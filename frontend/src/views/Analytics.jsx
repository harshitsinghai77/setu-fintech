import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import AnalyticsStastics from "@/components/AnalyticsStastics";
import AnalyticsPieCharts from "@/components/AnalyticsPieChart";
import AnalyticsTable from "@/components/AnalyticsTable";
import ApiService from "@/utils/apiService";

const apiService = new ApiService();

const AnalyticsOverview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await apiService.getAnalytics();
      setData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 size="34" className="animate-spin text-lg" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-red-500">Error fetching data. Please try again.</p>
          <Button onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <>
          {data && (
            <>
              {data.rpdAnalytics && data.pancardAnalytics && (
                <AnalyticsStastics
                  rpdAnalytics={data.rpdAnalytics}
                  pancardAnalytics={data.pancardAnalytics}
                />
              )}
              <Separator className="mb-8" />
              {data.rpdAnalytics && data.rpdAnalytics.groupByKey && (
                <>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Pie Chart of key metrics
                  </h3>
                  <AnalyticsPieCharts
                    groupByKey={data.rpdAnalytics.groupByKey}
                  />
                  <Separator className="mt-12 mb-8" />
                </>
              )}
              {data.pancardRawData && (
                <>
                  <h3 className="scroll-m-20 text-2xl mb-4 font-semibold tracking-tight">
                    PanCard Verification Data
                  </h3>
                  <AnalyticsTable pancardRawData={data.pancardRawData} />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default AnalyticsOverview;
