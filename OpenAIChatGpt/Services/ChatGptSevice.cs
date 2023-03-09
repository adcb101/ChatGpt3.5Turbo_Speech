using Microsoft.Extensions.Caching.Memory;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;

using System.Collections.Generic;
using System.Data;
using static OpenAI.GPT3.ObjectModels.SharedModels.IOpenAiModels;

namespace OpenAIChatGpt.Services
{
    public class ChatGptSevice : IChatGptSevice
    {
        private readonly IServiceProvider _serviceProvider;
        
        public ChatGptSevice(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            
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
                    chatMessages = externalList;

                }

                var completionResult = await openAiService.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
                {
                    Messages = chatMessages,

                    Model = OpenAI.GPT3.ObjectModels.Models.ChatGpt3_5Turbo,
                    MaxTokens = 1000//optional
                });
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