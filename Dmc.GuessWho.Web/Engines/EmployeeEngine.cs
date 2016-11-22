using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Dmc.GuessWho.Web.Dtos;
using Dmc.GuessWho.Web.Interfaces;
using Dmc.GuessWho.Web.Utilities;
using HtmlAgilityPack;

namespace Dmc.GuessWho.Web.Engines
{
    public class EmployeeEngine : IEmployeeEngine
    {
        private string _EmployeePageUrl;
        public string EmployeePageUrl {
            get
            {
                return this._EmployeePageUrl;
            }
            private set
            {
                this._EmployeePageUrl = value;
                this.EmployeePageUri = new Uri(value);
            }
        }

        public Uri EmployeePageUri { get; private set; }

        public EmployeeEngine(string employeePageUrl)
        {
            this.EmployeePageUrl = employeePageUrl;
        }

        public List<EmployeeDto> GetEmployees()
        {
            var employeePageContent = this.GetContentFromUrl(this.EmployeePageUrl);
            if (employeePageContent == null)
                return new List<EmployeeDto>();

            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(employeePageContent);
            if ((htmlDoc.ParseErrors != null && htmlDoc.ParseErrors.Any()) || htmlDoc.DocumentNode == null)
                return new List<EmployeeDto>();
            
            return this.ParseEmployeePageContent(htmlDoc, this.EmployeePageUri.Scheme + "://" + this.EmployeePageUri.Host);
        }

        private List<EmployeeDto> ParseEmployeePageContent(HtmlDocument htmlDoc, string urlBase)
        {
            var employees = new List<EmployeeDto>();
            var employeeBioElements = htmlDoc.DocumentNode.SelectNodes($"//div[{XPathUtils.GetContainsClassExpression("employee-bio-item")}]");
            foreach (var employeeBioElement in employeeBioElements)
            {
                var employee = new EmployeeDto();

                var bioNameHeader = employeeBioElement.SelectSingleNode($"h2[{XPathUtils.GetContainsClassExpression("employee-bio-name")}]");
                if (bioNameHeader != null)
                {
                    employee.Name = bioNameHeader.FirstChild.InnerHtml;
                }

                var bioImageNormal = employeeBioElement.SelectSingleNode($"a/img[{XPathUtils.GetContainsClassExpression("employee-bio-default-image")}]");
                if (bioImageNormal != null)
                {
                    employee.NormalImageUrl = urlBase + bioImageNormal.GetAttributeValue("src", string.Empty);
                }

                var bioImageFun = employeeBioElement.SelectSingleNode($"a/img[{XPathUtils.GetContainsClassExpression("employee-bio-alternate-image")}]");
                if (bioImageFun != null)
                {
                    employee.FunImageUrl = urlBase + bioImageFun.GetAttributeValue("src", string.Empty);
                }

                employees.Add(employee);
            }
            return employees;
        }

        private string GetContentFromUrl(string url)
        {
            var httpClient = new HttpClient();
            Uri resourceUri;
            if (!Uri.TryCreate(url, UriKind.Absolute, out resourceUri))
            {
                return null;
            }
            if (resourceUri.Scheme != "http" && resourceUri.Scheme != "https")
            {
                return null;
            }

            try
            {
                var response = httpClient.GetAsync(resourceUri).Result;
                response.EnsureSuccessStatusCode();
                return response.Content.ReadAsStringAsync().Result;
            }
            catch
            {
                return null;
            }
        }
    }
}