using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Team3.Curriculum.Entities;
using Team3.Curriculum.Enums;
using Team3.Curriculum.Services.Interfaces;

namespace Team3.Curriculum.Services.Implementations;

/// <summary>
/// Normalizes parsed structure nodes into draft curriculum entities.
/// </summary>
public class CurriculumNormalizer : ICurriculumNormalizer, ITransientDependency
{
    private readonly IRepository<TopicDraft, long> _topicDraftRepository;
    private readonly IRepository<LessonDraft, long> _lessonDraftRepository;
    private readonly IRepository<LessonMaterialDraft, long> _lessonMaterialDraftRepository;
    private readonly IRepository<QuizDraft, long> _quizDraftRepository;
    private readonly IRepository<QuizQuestionDraft, long> _quizQuestionDraftRepository;

    public CurriculumNormalizer(
        IRepository<TopicDraft, long> topicDraftRepository,
        IRepository<LessonDraft, long> lessonDraftRepository,
        IRepository<LessonMaterialDraft, long> lessonMaterialDraftRepository,
        IRepository<QuizDraft, long> quizDraftRepository,
        IRepository<QuizQuestionDraft, long> quizQuestionDraftRepository)
    {
        _topicDraftRepository = topicDraftRepository;
        _lessonDraftRepository = lessonDraftRepository;
        _lessonMaterialDraftRepository = lessonMaterialDraftRepository;
        _quizDraftRepository = quizDraftRepository;
        _quizQuestionDraftRepository = quizQuestionDraftRepository;
    }

    public async Task NormalizeAsync(List<ParsedStructureNode> nodes, long extractionJobId)
    {
        var chapters = nodes.Where(n => n.NodeType == StructureNodeType.Chapter).ToList();
        int topicOrder = 1;

        foreach (var chapter in chapters)
        {
            var topicDraft = new TopicDraft
            {
                ExtractionJobId = extractionJobId,
                Title = chapter.Title,
                Description = chapter.Content,
                Order = topicOrder++,
                Status = DraftStatus.Draft
            };

            await _topicDraftRepository.InsertAsync(topicDraft);

            // Process child nodes
            var childNodes = nodes.Where(n => n.ParentNodeId == chapter.Id).ToList();
            await ProcessChildNodesAsync(childNodes, topicDraft.Id, extractionJobId);
        }
    }

    private async Task ProcessChildNodesAsync(List<ParsedStructureNode> childNodes, long topicDraftId, long extractionJobId)
    {
        var lessons = childNodes.Where(n => n.NodeType == StructureNodeType.Unit || n.NodeType == StructureNodeType.Section).ToList();
        int lessonOrder = 1;

        foreach (var lessonNode in lessons)
        {
            var lessonDraft = new LessonDraft
            {
                TopicDraftId = topicDraftId,
                Title = lessonNode.Title,
                Description = lessonNode.Content,
                Order = lessonOrder++,
                Status = DraftStatus.Draft
            };

            await _lessonDraftRepository.InsertAsync(lessonDraft);

            // Create material drafts for examples, guided activities
            var materialNodes = childNodes.Where(n => n.NodeType == StructureNodeType.Example ||
                                                      n.NodeType == StructureNodeType.GuidedActivity ||
                                                      n.NodeType == StructureNodeType.Annexure ||
                                                      n.NodeType == StructureNodeType.Glossary).ToList();

            int materialOrder = 1;
            foreach (var materialNode in materialNodes)
            {
                var materialDraft = new LessonMaterialDraft
                {
                    LessonDraftId = lessonDraft.Id,
                    Title = materialNode.Title,
                    Content = materialNode.Content,
                    Order = materialOrder++,
                    Status = DraftStatus.Draft
                };

                await _lessonMaterialDraftRepository.InsertAsync(materialDraft);
            }

            // Create quiz drafts for activities
            var activityNodes = childNodes.Where(n => n.NodeType == StructureNodeType.Activity ||
                                                      n.NodeType == StructureNodeType.ConsolidationActivity ||
                                                      n.NodeType == StructureNodeType.EndOfTopicExercises).ToList();

            int quizOrder = 1;
            foreach (var activityNode in activityNodes)
            {
                var quizDraft = new QuizDraft
                {
                    LessonDraftId = lessonDraft.Id,
                    Title = activityNode.Title,
                    Description = activityNode.Content,
                    Order = quizOrder++,
                    Status = DraftStatus.Draft
                };

                await _quizDraftRepository.InsertAsync(quizDraft);

                // Create dummy questions
                for (int i = 1; i <= 3; i++)
                {
                    var question = new QuizQuestionDraft
                    {
                        QuizDraftId = quizDraft.Id,
                        QuestionText = $"Sample Question {i} for {activityNode.Title}",
                        OptionA = "Option A",
                        OptionB = "Option B",
                        OptionC = "Option C",
                        OptionD = "Option D",
                        CorrectAnswer = "A",
                        Explanation = "Sample explanation",
                        Order = i,
                        Status = DraftStatus.Draft
                    };

                    await _quizQuestionDraftRepository.InsertAsync(question);
                }
            }
        }
    }
}