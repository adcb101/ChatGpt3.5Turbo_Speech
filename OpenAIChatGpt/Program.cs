using NLog.Web;
using OpenAIChatGpt.Services;

namespace OpenAIChatGpt
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("nlogsetting.config").GetCurrentClassLogger();
            var builder = WebApplication.CreateBuilder(args);

          
            builder.Services.AddControllersWithViews();
            //builder.Services.AddOpenAIService(options =>
            //{   
            //    //options.ProviderType = ProviderType.Azure;
            //    options.ApiKey = builder.Configuration.GetSection("OpenAiKeyOption:key").Get<string>();
            //    //options.DeploymentId = "MyDeploymentId";
            //    //options.ResourceName = "MyResourceName";
            //});
           builder.Services.AddSingleton<IAmazonPollyservice , AmazonPollyservice>();

          
            builder.Host.UseNLog(new NLogAspNetCoreOptions { CaptureMessageTemplates = true, CaptureMessageProperties = true });
            
            //builder.Services.AddScoped<IChatGptSevice, ChatGptSevice>();
            builder.Services.AddScoped<IGptHttpClient,GptHttpClient>();
            builder.Services.AddMemoryCache();
           
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/ChatGpt/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=ChatGpt}/{action=Index}/{id?}");

            app.Run();
        }

        
}
}