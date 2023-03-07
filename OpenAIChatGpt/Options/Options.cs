using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAIChatGpt.Services;
using System.Data;

namespace OpenAIChatGpt.Options
{
    

    public abstract class GeneralOption
    {
        public string Name { get; set; } = String.Empty;
      
    }
    public class OpenAiKeyOption : GeneralOption
    {
        public string Key { get; set; } = String.Empty;
    }

}