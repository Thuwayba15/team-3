using Abp.Domain.Services;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using Team3.Enums;

#nullable enable

namespace Team3.Academic;

public class RecommendationEngine : DomainService
{
    private const decimal PercentMultiplier = 100m;
    private const decimal InterventionBoost = 20m;
    private const decimal RevisionBoost = 10m;
    private const decimal EarlySequenceBoostMax = 10m;

    public virtual IReadOnlyList<TopicWeaknessInsight> RankWeakTopicsByTopicProgress(
        IReadOnlyCollection<Topic> topics,
        IReadOnlyCollection<StudentTopicProgress> topicProgresses,
        int maxResults = 5)
    {
        Guard.Against.Null(topics);
        Guard.Against.Null(topicProgresses);
        Guard.Against.NegativeOrZero(maxResults);

        if (topics.Count == 0 || topicProgresses.Count == 0)
            return Array.Empty<TopicWeaknessInsight>();

        var progressByTopic = topicProgresses
            .GroupBy(p => p.TopicId)
            .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.CreationTime).First());

        return topics
            .Where(t => t.IsActive && progressByTopic.ContainsKey(t.Id))
            .Select(t => CreateWeaknessInsightFromTopicProgress(t, progressByTopic[t.Id]))
            .Where(w => w.IsWeak)
            .OrderByDescending(w => w.PriorityScore)
            .ThenBy(w => w.MasteryPercent)
            .ThenBy(w => w.TopicSequenceOrder)
            .Take(maxResults)
            .ToList();
    }

    public virtual Lesson? SelectNextLessonByTopicProgress(
        IReadOnlyCollection<Topic> topics,
        IReadOnlyCollection<Lesson> lessons,
        IReadOnlyCollection<StudentTopicProgress> topicProgresses)
    {
        Guard.Against.Null(topics);
        Guard.Against.Null(lessons);
        Guard.Against.Null(topicProgresses);

        if (topics.Count == 0 || lessons.Count == 0 || topicProgresses.Count == 0)
            return null;

        var weakTopics = RankWeakTopicsByTopicProgress(topics, topicProgresses, topics.Count);
        if (weakTopics.Count == 0)
            return null;

        var lessonsByTopic = lessons
            .Where(l => l.IsPublished)
            .GroupBy(l => l.TopicId)
            .ToDictionary(
                g => g.Key,
                g => g
                    .OrderBy(l => l.DifficultyLevel)
                    .ThenBy(l => l.EstimatedMinutes)
                    .ThenBy(l => l.Title)
                    .ToList());

        foreach (var weakTopic in weakTopics)
        {
            if (lessonsByTopic.TryGetValue(weakTopic.TopicId, out var candidates) && candidates.Count > 0)
                return candidates[0];
        }

        return null;
    }

    private static TopicWeaknessInsight CreateWeaknessInsightFromTopicProgress(Topic topic, StudentTopicProgress progress)
    {
        var masteryPercent = ClampPercent(progress.MasteryScore);
        var thresholdPercent = ClampPercent(topic.MasteryThreshold * PercentMultiplier);
        var deficit = Math.Max(0m, thresholdPercent - masteryPercent);
        var seqBoost = ComputeEarlySequenceBoost(topic.SequenceOrder);
        var notCompleted = progress.Status != LearningProgressStatus.Completed;

        var priority = deficit
            + (notCompleted ? RevisionBoost : 0m)
            + (progress.NeedsRevision ? InterventionBoost : 0m)
            + seqBoost;

        var isWeak = masteryPercent < thresholdPercent || progress.NeedsRevision || notCompleted;

        return new TopicWeaknessInsight(
            topic.Id, topic.SubjectId, topic.Name, topic.SequenceOrder,
            masteryPercent, thresholdPercent, notCompleted, progress.NeedsRevision, isWeak, priority);
    }

    private static decimal ClampPercent(decimal value) 
        => Math.Min(PercentMultiplier, Math.Max(0m, decimal.Round(value, 2)));

    private static decimal ComputeEarlySequenceBoost(int sequenceOrder) 
        => decimal.Round(Math.Max(0m, EarlySequenceBoostMax - sequenceOrder), 2);
}

public sealed class TopicWeaknessInsight
{
    public Guid TopicId { get; }
    public Guid SubjectId { get; }
    public string TopicName { get; }
    public int TopicSequenceOrder { get; }
    public decimal MasteryPercent { get; }
    public decimal ThresholdPercent { get; }
    public bool NeedsIntervention { get; }
    public bool RevisionNeeded { get; }
    public bool IsWeak { get; }
    public decimal PriorityScore { get; }

    public TopicWeaknessInsight(Guid topicId, Guid subjectId, string topicName, int order,
        decimal masterPercent, decimal threshold, bool intervention, bool revision, bool weak, decimal priority)
    {
        TopicId = Guard.Against.Default(topicId);
        SubjectId = Guard.Against.Default(subjectId);
        TopicName = Guard.Against.NullOrWhiteSpace(topicName).Trim();
        TopicSequenceOrder = order;
        MasteryPercent = masterPercent;
        ThresholdPercent = threshold;
        NeedsIntervention = intervention;
        RevisionNeeded = revision;
        IsWeak = weak;
        PriorityScore = priority;
    }
}

#nullable disable
