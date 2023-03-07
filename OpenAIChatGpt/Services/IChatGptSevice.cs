using OpenAI.GPT3.ObjectModels.RequestModels;

namespace OpenAIChatGpt.Services
{
    public interface IChatGptSevice

    {
        public Task<ChatMessage> ChatAsync(string role, string content, string key);
    }
}