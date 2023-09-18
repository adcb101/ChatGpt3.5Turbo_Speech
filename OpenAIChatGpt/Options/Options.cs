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