using OpenAI.GPT3.Extensions;
using OpenAIChatGpt.Services;

namespace OpenAIChatGpt
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();
            builder.Services.AddOpenAIService(options =>
            {   
                //options.ProviderType = ProviderType.Azure;
                options.ApiKey = builder.Configuration.GetSection("OpenAiKeyOption:key").Get<string>();
                //options.DeploymentId = "MyDeploymentId";
                //options.ResourceName = "MyResourceName";
            });

            builder.Services.AddScoped<IChatGptSevice, ChatGptSevice>();
            builder.Services.AddMemoryCache();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}