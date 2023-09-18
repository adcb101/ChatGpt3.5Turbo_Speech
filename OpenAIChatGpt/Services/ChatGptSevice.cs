using Microsoft.Extensions.Caching.Memory;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using System.Diagnostics;

namespace OpenAIChatGpt.Services
{
    public class ChatGptSevice : IChatGptSevice
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ChatGptSevice> _logger;

       

        public ChatGptSevice(IServiceProvider serviceProvider, ILogger<ChatGptSevice> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task<ChatMessage> ChatAsync(string role, string content, string key)
        {

            try
            {
                var openAiService = _serviceProvider.GetRequiredService<IOpenAIService>();
                var cache = _serviceProvider.GetRequiredService<IMemoryCache>();
                
                List<ChatMessage> chatMessages = new List<ChatMessage>();

                ChatMessage messageUser = new ChatMessage(role, content);
                chatMessages.Add(messageUser);

                if (cache.Get(key) is List<ChatMessage> externalList)
                {
                    externalList.Add(messageUser);
                    chatMessages.Clear();
                    if (externalList.Count>10)
                        externalList.RemoveRange(0, externalList.Count - 4);
                    chatMessages = externalList;

                }
                Stopwatch sw = new Stopwatch();
                sw.Start();
                
                var completionResult = await openAiService.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
                {
                    Messages = chatMessages,

                    Model = OpenAI.GPT3.ObjectModels.Models.ChatGpt3_5Turbo,
                    MaxTokens = 1000//optional
                });
                sw.Stop();
                
                _logger.LogInformation($"程序耗时：{sw.Elapsed.TotalSeconds}s.");
                //Console.WriteLine($"程序耗时：{sw.ElapsedMilliseconds}ms.");
                if (completionResult.Successful)
                {
                    int x = chatMessages.Count;
                    ChatMessage messageAssistant = new ChatMessage(StaticValues.ChatMessageRoles.Assistant, completionResult.Choices.First().Message.Content);
                    chatMessages.Add(messageAssistant);
                    cache.Set(key, chatMessages);
                    return messageAssistant;
                }
                return messageUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            

        }


    }
}