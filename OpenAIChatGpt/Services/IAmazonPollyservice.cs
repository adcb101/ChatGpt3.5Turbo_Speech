using Amazon.Polly;

namespace OpenAIChatGpt.Services
{
    public interface IAmazonPollyservice
    {
        Task<List<PollyLanguage>> GetVoices();
        Task<byte[]> Speak(string text, VoiceId voiceId, LanguageCode languageCode);
    }
}
