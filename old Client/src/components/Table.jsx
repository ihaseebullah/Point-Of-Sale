import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

export default function Table() {
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      axios
        .get("/pos/dashboard/getInvoices")
        .then((res) => setTableData(res.data.data))
        .then(() => {
          setLoading(false);
        });
    } catch (e) {
      toast.error(e ? e : "Something went wrong");
    }
  }, []);
  return (
    <div className="row">
      <Toaster />
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Our Clients</h3>
            <div className="card-tools">
              <div
                className="input-group input-group-sm"
                style={{ width: 150 }}
              >
                <input
                  type="text"
                  name="table_search"
                  className="form-control float-right"
                  placeholder="Search"
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-default">
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /.card-header */}
          <div className="card-body table-responsive p-0">
            {loading && <Loader />}
            {!loading && (
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData != undefined &&
                    tableData.map((i) => {
                      return (
                        <tr key={i._id}>
                          <td>{i.customerName}</td>
                          <td>{i.createdAt}</td>
                          <td>11-7-2014</td>
                          <td>
                            <span className="tag tag-danger">Denied</span>
                          </td>
                          <td>
                            Bacon ipsum dolor sit amet salami venison chicken
                            flank fatback doner.
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </div>
    </div>
  );
}
