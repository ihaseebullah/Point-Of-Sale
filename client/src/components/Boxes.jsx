import { useEffect, useState } from "react";
import Box from "./Box";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
export default function Boxes() {
  const [inContact, setIncontact] = useState(false);
  const [inContact2, setIncontact2] = useState(false);
  const [inContact3, setIncontact3] = useState(false);
  const [inContact4, setIncontact4] = useState(false);
  const [inContact5, setIncontact5] = useState(false);
  const [inContact6, setIncontact6] = useState(false);
  const [inContact7, setIncontact7] = useState(false);
  const [inContact8, setIncontact8] = useState(false);
  const [inventory, setInventory] = useState(0);
  const [sales, setSale] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  const [invoices, setInvoices] = useState(0);
  const [mails, setMails] = useState(0);
  const [returns, setReturns] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [profit, setProfit] = useState(0);
  const [maxProfit, setMaxProfit] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/pos/dashboard/info").then((res) => {
          let totallAmount = 0;
          let totallAmountReturned = 0;
          res.data.data.invoices.map((invoice) => {
            if (invoice.returned) {
              totallAmountReturned =
                invoice.totallWithDiscount + totallAmountReturned;
            } else {
              totallAmount = invoice.totallWithDiscount + totallAmount;
            }
          });
          setSale(
            (totallAmount - totallAmountReturned).toLocaleString("en-PK", {
              style: "currency",
              currency: "PKR",
            })
          );
          setInventory(res.data.data.inventory.length);

          setInvoices(res.data.data.invoices.length);
          let returnedCounter = 0;
          res.data.data.invoices.map((invoice) => {
            if (invoice.returned === true) {
              returnedCounter++;
            }
          });
          setReturns(
            totallAmountReturned.toLocaleString("en-PK", {
              style: "currency",
              currency: "PKR",
            })
          );
          let purchases = 0;
          console.log(res.data.data.dealers);
          res.data.data.dealers.map((dealer) => {
            if (dealer.totallPurchases) {
              purchases += dealer.totallPurchases;
            }
          });
          setPurchases(purchases);
          setMails(res.data.data.mails);
          let maxProfitt = res.data.data.profit.map((profit) => {
            if (profit.profit === "NaN") {
              return 0;
            }
            return parseInt(profit.profit);
          });
          let ProfitableProduct = res.data.data.profit.filter((profit) => {
            return profit.profit === `${Math.max(...maxProfitt)}`;
          });
          setMaxProfit(ProfitableProduct);
          setProfit(
            maxProfitt.reduce(
              (acumulator, currentValue) => acumulator + currentValue,
              0
            )
          );
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [relod]);
  return (
    <div className="row">
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact(true);
        }}
        onMouseLeave={() => {
          setIncontact(false);
        }}
      >
        <Box
          inContact={inContact}
          value={inventory}
          name="Inventory"
          anchor="inventory"
          icon={1}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact2(true);
        }}
        onMouseLeave={() => {
          setIncontact2(false);
        }}
      >
        <Box
          inContact={inContact2}
          value={sales}
          name="Sales"
          anchor="sales"
          icon={0}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact3(true);
        }}
        onMouseLeave={() => {
          setIncontact3(false);
        }}
      >
        <Box
          inContact={inContact3}
          value={invoices}
          name="Invoices"
          anchor="invoices"
          icon={2}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact4(true);
        }}
        onMouseLeave={() => {
          setIncontact4(false);
        }}
      >
        <Box
          inContact={inContact4}
          value={mails}
          name="Messages"
          anchor="messages"
          icon={3}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact5(true);
        }}
        onMouseLeave={() => {
          setIncontact5(false);
        }}
      >
        <Box
          inContact={inContact5}
          value={returns}
          name="Returns"
          anchor="returns"
          icon={4}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact6(true);
        }}
        onMouseLeave={() => {
          setIncontact6(false);
        }}
      >
        <Box
          inContact={inContact6}
          value={purchases.toLocaleString("en-PK", {
            style: "currency",
            currency: "PKR",
          })}
          name="Purchases"
          anchor="suppliers"
          icon={5}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact7(true);
        }}
        onMouseLeave={() => {
          setIncontact7(false);
        }}
      >
        <Box
          inContact={inContact7}
          value={profit.toLocaleString("en-PK", {
            style: "currency",
            currency: "PKR",
          })}
          name="Net Profit"
          anchor="profit"
          icon={6}
        />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact8(true);
        }}
        onMouseLeave={() => {
          setIncontact8(false);
        }}
      >
        <Box
          inContact={"success"}
          value={maxProfit[0]?maxProfit[0].productName:"Calculating..."}
          name="Most Profitable Product"
          anchor="profit"
          icon={7}
        />
      </div>
    </div>
  );
}
