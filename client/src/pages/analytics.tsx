import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Page Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">124,592</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3% from last week
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">34.2%</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.1% from last week
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Session Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4m 32s</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.7% from last week
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,847</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +23.1% from last week
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">G</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Google Search</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">45,234</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">42.3%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">D</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Direct</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">23,456</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">21.9%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">S</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Social Media</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">12,789</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">11.9%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Popular Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">/dashboard</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Main dashboard page</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">34,567</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">32.3%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">/products</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Product catalog</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">23,445</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">21.9%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">/users</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">User management</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">18,234</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">17.0%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
