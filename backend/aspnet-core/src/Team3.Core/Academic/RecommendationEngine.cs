using Abp.Domain.Services;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;

#nullable enable

namespace Team3.Academic;

/// <summary>
/// Provides deterministic recommendation logic for student learning paths.
/// This domain service ranks weak topics and selects the next lesson without AI dependencies.
/// </summary>
public class RecommendationEngine : DomainService
{
    private const decimal PercentMultiplier = 100m;
    private const decimal InterventionBoost = 20m;
    private const decimal RevisionBoost = 10m;
    private const decimal EarlySequenceBoostMax = 10m;

    /// <summary>
    /// Ranks weak topics for a student using subject-level mastery and intervention signals.
    /// </summary>
    /// <param name="topics">Active curriculum topics across enrolled subjects.</param>
    /// <param name="subjectProgresses">Student subject progress records used as topic mastery proxy.</param>
    /// <param name="maxResults">Maximum ranked items to return.</param>
    /// <returns>Ordered weak-topic insights (highest priority first).</returns>
    public virtual IReadOnlyList<TopicWeaknessInsight> RankWeakTopics(
        IReadOnlyCollection<Topic> topics,
        IReadOnlyCollection<StudentProgress> subjectProgresses,
        int maxResults = 5)
    {
        Guard.Against.Null(topics);
        Guard.Against.Null(subjectProgresses);
        Guard.Against.NegativeOrZero(maxResults);

        if (topics.Count == 0 || subjectProgresses.Count == 0)
        {
            return Array.Empty<TopicWeaknessInsight>();
        }

        var progressBySubject = subjectProgresses
            .GroupBy(progress => progress.SubjectId)
            .ToDictionary(group => group.Key, group => group.OrderByDescending(item => item.UpdatedAt).First());

        var ranked = topics
            .Where(topic => topic.IsActive && progressBySubject.ContainsKey(topic.SubjectId))
            .Select(topic => CreateWeaknessInsight(topic, progressBySubject[topic.SubjectId]))
            .Where(insight => insight.IsWeak)
            .OrderByDescending(insight => insight.PriorityScore)
            .ThenBy(insight => insight.MasteryPercent)
            .ThenBy(insight => insight.TopicSequenceOrder)
            .Take(maxResults)
            .ToList();

        return ranked;
    }

    /// <summary>
    /// Selects the next lesson by traversing weak topics in priority order.
    /// </summary>
    /// <param name="topics">Active curriculum topics across enrolled subjects.</param>
    /// <param name="lessons">Lessons available for candidate topics.</param>
    /// <param name="subjectProgresses">Student subject progress records used as topic mastery proxy.</param>
    /// <returns>The next recommended published lesson, or null when none is available.</returns>
    public virtual Lesson? SelectNextLesson(
        IReadOnlyCollection<Topic> topics,
        IReadOnlyCollection<Lesson> lessons,
        IReadOnlyCollection<StudentProgress> subjectProgresses)
    {
        Guard.Against.Null(topics);
        Guard.Against.Null(lessons);
        Guard.Against.Null(subjectProgresses);

        if (topics.Count == 0 || lessons.Count == 0 || subjectProgresses.Count == 0)
        {
            return null;
        }

        var weakTopics = RankWeakTopics(topics, subjectProgresses, maxResults: topics.Count);
        if (weakTopics.Count == 0)
        {
            return null;
        }

        var lessonsByTopic = lessons
            .Where(lesson => lesson.IsPublished)
            .GroupBy(lesson => lesson.TopicId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(lesson => lesson.DifficultyLevel)
                    .ThenBy(lesson => lesson.EstimatedMinutes)
                    .ThenBy(lesson => lesson.Title)
                    .ToList());

        foreach (var weakTopic in weakTopics)
        {
            if (lessonsByTopic.TryGetValue(weakTopic.TopicId, out var candidateLessons) && candidateLessons.Count > 0)
            {
                return candidateLessons[0];
            }
        }

        return null;
    }

    private static TopicWeaknessInsight CreateWeaknessInsight(Topic topic, StudentProgress progress)
    {
        var masteryPercent = ClampPercent(progress.MasteryScore * PercentMultiplier);
        var thresholdPercent = ClampPercent(topic.MasteryThreshold * PercentMultiplier);
        var masteryDeficit = Math.Max(0m, thresholdPercent - masteryPercent);
        var sequenceBoost = ComputeEarlySequenceBoost(topic.SequenceOrder);

        var priorityScore = masteryDeficit
            + (progress.NeedsIntervention ? InterventionBoost : 0m)
            + (progress.RevisionNeeded ? RevisionBoost : 0m)
            + sequenceBoost;

        var isWeak = masteryPercent < thresholdPercent || progress.NeedsIntervention || progress.RevisionNeeded;

        return new TopicWeaknessInsight(
            topicId: topic.Id,
            subjectId: topic.SubjectId,
            topicName: topic.Name,
            topicSequenceOrder: topic.SequenceOrder,
            masteryPercent: masteryPercent,
            thresholdPercent: thresholdPercent,
            needsIntervention: progress.NeedsIntervention,
            revisionNeeded: progress.RevisionNeeded,
            isWeak: isWeak,
            priorityScore: priorityScore);
    }

    private static decimal ClampPercent(decimal value)
    {
        return Math.Min(PercentMultiplier, Math.Max(0m, decimal.Round(value, 2)));
    }

    private static decimal ComputeEarlySequenceBoost(int sequenceOrder)
    {
        var normalizedOrder = Math.Max(0, sequenceOrder);
        var boost = EarlySequenceBoostMax - Math.Min(EarlySequenceBoostMax, normalizedOrder);
        return decimal.Round(boost, 2);
    }
}

/// <summary>
/// Computed weakness insight used to prioritize topics for recommendation.
/// </summary>
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

    public TopicWeaknessInsight(
        Guid topicId,
        Guid subjectId,
        string topicName,
        int topicSequenceOrder,
        decimal masteryPercent,
        decimal thresholdPercent,
        bool needsIntervention,
        bool revisionNeeded,
        bool isWeak,
        decimal priorityScore)
    {
        TopicId = Guard.Against.Default(topicId);
        SubjectId = Guard.Against.Default(subjectId);
        TopicName = Guard.Against.NullOrWhiteSpace(topicName).Trim();
        TopicSequenceOrder = topicSequenceOrder;
        MasteryPercent = masteryPercent;
        ThresholdPercent = thresholdPercent;
        NeedsIntervention = needsIntervention;
        RevisionNeeded = revisionNeeded;
        IsWeak = isWeak;
        PriorityScore = priorityScore;
    }
}

#nullable disable
