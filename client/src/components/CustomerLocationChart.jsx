import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import toast from "react-hot-toast";
const chartSetting = {
  xAxis: [
    {
      label: "Sales Worth (PKR)",
    },
  ],
  height: 500,
};
const valueFormatter = (value) =>
  value.toLocaleString("en-PK", { style: "currency", currency: "PKR" });
export default function CustomerLocationChart() {
  const [dataSet, setDataSet] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/pos/dashboard/locations");
        if (res.data.data.length > 0) {
          const response = res.data.data;

          const result = {};

          response.forEach((obj) => {
            const address = obj.address;

            if (!result[address]) {
              result[address] = {
                sale: 0,
                returned: 0,
                id: Math.floor(Math.random() * 100),
                location: address,
              };
            }

            if (obj.returned) {
              result[address].returned += obj.totallWithDiscount;
            } else {
              result[address].sale += obj.totallWithDiscount;
            }
          });

          const finalResult = Object.values(result);
          const sortedResult = finalResult.sort((a, b) => b.sale - a.sale);

          setDataSet(sortedResult);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e);
        toast.error(e.message);
      }
    };

    getData();
  }, []);
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <i className="ion ion-clipboard " />
          Location Tracker
        </h3>
      </div>
      <div className="card-body ">
        {dataSet.length === 0 ? (
          <p>No Sales yet</p>
        ) : (
          <BarChart
            dataset={dataSet}
            yAxis={[{ scaleType: "band", dataKey: "location" }]}
            series={[
              { dataKey: "sale", label: "Sale Area wise", valueFormatter },
              {
                dataKey: "returned",
                label: "Returned Area wise",
                valueFormatter,
              },
            ]}
            layout="horizontal"
            {...chartSetting}
          />
        )}
      </div>
    </div>
  );
}
