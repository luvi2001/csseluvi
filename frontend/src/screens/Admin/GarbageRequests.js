import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GarbageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [wasteCollectors, setWasteCollectors] = useState([]);

  // Fetch garbage requests
  useEffect(() => {
    const fetchRequests = async () => {
        try {
          const response = await axios.get('http://192.168.8.169:5000/api/admin/garbage-requests');
          setRequests(response.data);
        } catch (error) {
          console.error('Error fetching requests', error);
        }
      };

    fetchRequests();
  }, []);

  // Fetch waste collectors
  useEffect(() => {
    const fetchWasteCollectors = async () => {
        try {
          const response = await axios.get('http://192.168.8.169:5000/api/admin/waste-collectors');
          setWasteCollectors(response.data);
        } catch (error) {
          console.error('Error fetching waste collectors', error);
        }
      };

    fetchWasteCollectors();
  }, []);

  // Update status and waste collector
  const handleUpdateRequest = async (requestId, status, wasteCollector) => {
    try {
      const response = await axios.put(`http://192.168.8.169:5000/api/admin/garbage-requests/${requestId}`, {
        status,
        wasteCollector
      });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? response.data : req
        )
      );
    } catch (error) {
      console.error('Error updating request', error);
    }
  };

  return (
    <div>
      <h2>Garbage Collection Requests</h2>
      {requests.map((request) => (
        <div key={request._id} style={{ marginBottom: '20px' }}>
          <p><strong>Resident Name:</strong> {request.residentName}</p>
          <p><strong>Address:</strong> {request.residentAddress}</p>
          <p><strong>Status:</strong></p>
          <select
            value={request.status}
            onChange={(e) =>
              handleUpdateRequest(request._id, e.target.value, request.wasteCollector?._id)
            }
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <p><strong>Waste Collector:</strong></p>
          <select
            value={request.wasteCollector?._id || ''}
            onChange={(e) =>
              handleUpdateRequest(request._id, request.status, e.target.value)
            }
          >
            <option value="">No Waste Collector</option>
            {wasteCollectors.map((collector) => (
              <option key={collector._id} value={collector._id}>
                {collector.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default GarbageRequests;
