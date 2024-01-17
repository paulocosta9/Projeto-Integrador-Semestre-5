using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Infrastructure.Armazens;
using DDDSample1.Infrastructure.Entregas;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Armazens;
using DDDSample1.Domain.Entregas;

namespace DDDSample1
{
    public class Startup
    {


        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseSqlServer("Password=JlEszGHIDw==Xa5;Persist Security Info=True;User ID=sa;Initial Catalog=master;Data Source=vsgate-s1.dei.isep.ipp.pt,10482;")
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());




            ConfigureMyServices(services);


            services.AddCors();
            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseCors(builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<IArmazemRepositorio, ArmazemRepositorio>();
            services.AddTransient<ArmazemServico>();

            services.AddTransient<IEntregaRepositorio, EntregaRepositorio>();
            services.AddTransient<EntregaServico>();
        }
    }
}
