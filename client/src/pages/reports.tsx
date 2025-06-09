import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, TrendingUp } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      title: "Monthly Sales Report",
      description: "Comprehensive sales analysis for the current month",
      type: "Sales",
      lastGenerated: "Oct 15, 2024",
      size: "2.4 MB",
      icon: TrendingUp,
    },
    {
      title: "User Activity Report",
      description: "Detailed user engagement and activity metrics",
      type: "Analytics",
      lastGenerated: "Oct 14, 2024",
      size: "1.8 MB",
      icon: FileText,
    },
    {
      title: "Financial Summary",
      description: "Complete financial overview including revenue and expenses",
      type: "Finance",
      lastGenerated: "Oct 13, 2024",
      size: "3.2 MB",
      icon: TrendingUp,
    },
    {
      title: "Inventory Report",
      description: "Current stock levels and inventory movements",
      type: "Inventory",
      lastGenerated: "Oct 12, 2024",
      size: "1.5 MB",
      icon: FileText,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate and download business reports</p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                Weekly
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Reports
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Generate instant reports for quick insights
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                Monthly
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Scheduled Reports
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Set up automated report generation
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full">
                Custom
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Custom Reports
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create detailed custom reports
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Create Custom
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => {
              const Icon = report.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last generated: {report.lastGenerated}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
