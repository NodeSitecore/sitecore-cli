<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using Unicorn.Configuration;
using Unicorn.Configuration.Dependencies;
using Newtonsoft.Json;

public class Handler : IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        var selectedConfigurations = UnicornConfigurationManager.Configurations;
        var resolver = new InterconfigurationDependencyResolver();

        var allConfigurations = resolver.OrderByDependencies(selectedConfigurations);
        var listConfigurations =  new List<Object>();

        foreach (var configuration in allConfigurations)
        {
            listConfigurations.Add(new{
                name = configuration.Name,
                description = configuration.Description,
                dependencies = configuration.Dependencies.ToList().ConvertAll(s => s.Trim()).Distinct()
            });
        }

        var json = JsonConvert.SerializeObject(listConfigurations.ToArray(), Formatting.Indented);
        // Comment out these lines first:
        context.Response.ContentType = "application/json";
        context.Response.Write(json);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }
}