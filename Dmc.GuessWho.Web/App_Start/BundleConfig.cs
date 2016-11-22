using System.Web.Optimization;

namespace Dmc.GuessWho.Web
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/css")
                .Include("~/Content/tether.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/dmc-guess-who.css"));

            bundles.Add(new ScriptBundle("~/bundles/js-libs")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/tether.js")
                .Include("~/Scripts/bootstrap.js")
                .Include("~/Scripts/shim.min.js")
                .Include("~/Scripts/zone.js")
                .Include("~/Scripts/Reflect.js")
                .Include("~/Scripts/system.src.js"));

            //bundles.Add(new ScriptBundle("~/bundles/dmc-guess-who")
            //    .Include("~/Scripts/App/*.js"));

            BundleTable.EnableOptimizations = true;
        }
    }
}