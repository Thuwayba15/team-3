using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Ardalis.GuardClauses;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.AI;
using Team3.Configuration;
using Team3.Enums;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials
{
    [AbpAllowAnonymous]
        public class Greetings : Team3AppServiceBase, IGreetingsAppService
    {
        private static readonly string[] RequiredTranslationLanguageCodes = ["zu", "st", "af"];

        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<Topic, Guid> _topicRepository;
        private readonly IRepository<Lesson, Guid> _lessonRepository;
        private readonly IRepository<LessonTranslation, Guid> _lessonTranslationRepository;
        private readonly IRepository<SourceMaterial, Guid> _sourceMaterialRepository;
        private readonly IRepository<Language, Guid> _languageRepository;
        private readonly ITextTranslationService _translationService;

        public Greetings(
            IRepository<Subject, Guid> subjectRepository,
            IRepository<Topic, Guid> topicRepository,
            IRepository<Lesson, Guid> lessonRepository,
            IRepository<LessonTranslation, Guid> lessonTranslationRepository,
            IRepository<SourceMaterial, Guid> sourceMaterialRepository,
            IRepository<Language, Guid> languageRepository,
            ITextTranslationService translationService
            )
        {
            _subjectRepository = subjectRepository;
            _topicRepository = topicRepository;
            _lessonRepository = lessonRepository;
            _lessonTranslationRepository = lessonTranslationRepository;
            _sourceMaterialRepository = sourceMaterialRepository;
            _languageRepository = languageRepository;
            _translationService = translationService;
        }



        [Abp.Authorization.AbpAllowAnonymous]
        public async Task<string> GreetAsync(UploadTextLearningMaterialInput input)
        {

            return "Hello world";
            
        }

        private static LessonTranslationDto MapTranslationDto(Language language, LessonTranslation translation)
        {
            return new LessonTranslationDto
            {
                LanguageCode = language.Code,
                LanguageName = language.Name,
                Title = translation.Title,
                Content = translation.Content,
                Summary = translation.Summary,
                Examples = translation.Examples,
                RevisionSummary = translation.RevisionSummary,
                IsAutoTranslated = translation.IsAutoTranslated
            };
        }

       

       
      
    }
    }
