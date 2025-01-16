import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';

// ... existing imports ...

function CardViewSiteRequirement() {
    const { siteId } = useParams();
    const [siteRequirement, setSiteRequirement] = useState(null);
    const [requestedBy, setRequestedBy] = useState('');

    useEffect(() => {
        const fetchSiteRequirement = async () => {
            try {
                console.log(siteId);
                const response = await api.get(`/site-requirements/${siteId}`);
                console.log(response.data); 
                setSiteRequirement(response.data);
            } catch (error) {
                console.error('Error fetching site requirement:', error);
            }
        };

        // const fetchRequestedBy = async () => {
        //     try {
        //         const response = await api.get('/verify-token');
        //         setRequestedBy(response.data.oid);
        //     } catch (error) {
        //         console.error('Error fetching requested by:', error);
        //     }
        // };

        fetchSiteRequirement();
        // fetchRequestedBy();
    }, [    siteId]);

    if (!siteRequirement) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Site Requirement Details</h1>
            <p>Site ID: {siteRequirement.siteId}</p>
            <p>Date of Request: {new Date(siteRequirement.dateOfRequest).toLocaleDateString()}</p>
            <p>Requested By: {requestedBy}</p>
            <p>Due Days: {siteRequirement.dueDays}</p>
            <p>Cleared: {siteRequirement.cleared ? 'Yes' : 'No'}</p>
            <p>Delivered: {siteRequirement.isDelivered ? 'Yes' : 'No'}</p>
            <h2>Items</h2>
            <ul>
                {siteRequirement.listOfItems.map(item => (
                    <li key={item.ItemObjectId}>
                        Item ID: {item.ItemObjectId}, Quantity: {item.ReqQty}
                    </li>
                ))}
            </ul>
            <h2>Products</h2>
            <ul>
                {siteRequirement.listOfProduct.map(product => (
                    <li key={product.Product}>
                        Product ID: {product.Product}, Quantity: {product.ReqQty}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CardViewSiteRequirement;
