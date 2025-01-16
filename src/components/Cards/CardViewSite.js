import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from 'views/auth/api';
import RenderDictionary from 'components/utils/dictionaryRendering';

const SiteView = () => {
  const { siteId } = useParams(); // Get siteId from the URL
  const [siteData, setSiteData] = useState(null);
  const [tenderData, setTenderData] = useState(null);
  const [boqData, setBoqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStages, setExpandedStages] = useState({}); // Track expanded products for each stage
  const [expandedBoq, setExpandedBoq] = useState(false); // Track expanded BOQ items

  useEffect(() => {
      const fetchSiteDetails = async () => {
          try {
              const siteResponse = await api.get(`/sites/${siteId}`);
              const site = siteResponse.data;

              if (!site) {
                  setError('No site data found.');
                  setLoading(false);
                  return;
              }

              const tenderResponse = await api.get(`/lead/${site.tenderId}`);
              const boqResponse = await api.get(`/boq-details/${site.boqId}`);

              setTenderData(tenderResponse.data);
              setBoqData(boqResponse.data);

              const expandedStagesData = await Promise.all(
                  site.stages.map(async (stage) => {
                      const expandedProductList = await Promise.all(
                          stage.subBoq.ProductList.map(async (product) => {
                              try {
                                  const productDetails = await api.get(`/product-details/${product.Product}`);
                                  const itemDetailsList = await Promise.all(
                                      productDetails.data.itemList.map(async (item) => {
                                          try {
                                              const itemDetails = await api.get(`/item-details/${item.ItemObjectId}`);
                                              return { ...item, details: itemDetails.data };
                                          } catch (err) {
                                              console.error(`Error fetching item details for ItemObjectId: ${item.ItemObjectId}`, err);
                                              return null;
                                          }
                                      })
                                  );
                                  return { ...product, details: { ...productDetails.data, itemList: itemDetailsList.filter(Boolean) } };
                              } catch (err) {
                                  console.error(`Error fetching product details for Product ID: ${product.Product}`, err);
                                  return null;
                              }
                          })
                      );

                      const expandedItemList = await Promise.all(
                          stage.subBoq.ItemList.map(async (item) => {
                              try {
                                  const itemDetails = await api.get(`/item-details/${item.ItemObjectId}`);
                                  return { ...item, details: itemDetails.data };
                              } catch (err) {
                                  console.error(`Error fetching item details for ItemObjectId: ${item.ItemObjectId}`, err);
                                  return null;
                              }
                          })
                      );

                      return {
                          ...stage,
                          subBoq: {
                              ...stage.subBoq,
                              ProductList: expandedProductList.filter(Boolean),
                              ItemList: expandedItemList.filter(Boolean),
                          },
                      };
                  })
              );

              setSiteData({ ...site, stages: expandedStagesData });
              setLoading(false);
          } catch (err) {
              console.error('Error fetching site, tender, or BOQ details:', err);
              setError('Failed to fetch site, tender, or BOQ details.');
              setLoading(false);
          }
      };

      fetchSiteDetails();
  }, [siteId]);

  const toggleDropdown = (stageIndex, productId) => {
      setExpandedStages((prev) => {
          const currentStage = prev[stageIndex] || {};
          return {
              ...prev,
              [stageIndex]: {
                  ...currentStage,
                  [productId]: !currentStage[productId],
              },
          };
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

    return (
      

        <div>
            {/* <h2>Tender Details</h2>
      {tenderData ? (
          <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
              <strong>Tender Name:</strong> {tenderData.TenderName} <br />
              <strong>Description:</strong> {tenderData.TenderDescription} <br />
              <strong>Tender No:</strong> {tenderData.TenderNo} <br />
              <strong>Publishing Date:</strong> {new Date(tenderData.TenderPublisingDate).toLocaleDateString()} <br />
              <strong>Submission Date:</strong> {new Date(tenderData.TenderSubmissionDate).toLocaleDateString()} <br />
              <strong>Fee:</strong> {tenderData.TenderFee} <br />
              <strong>Source:</strong> {tenderData.TenderSource}
          </div>
      ) : (
          <div>Loading tender details...</div>
      )} */}
        <div>
          <h1>Tender Details</h1>
        <RenderDictionary data={tenderData}/>
        </div>

        <div>
          <h1>BOQ Details</h1>
        <RenderDictionary data={boqData}/>
        </div>

      {/* <h2>BOQ Details</h2>
      {boqData ? (
          <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
              <strong>BOQ Serial No:</strong> {boqData.BoqSerialNo} <br />
              <button onClick={() => setExpandedBoq(!expandedBoq)}>
                  {expandedBoq ? 'Hide BOQ Items' : 'Show BOQ Items'}
              </button>
              {expandedBoq && (
                  <div style={{ marginTop: '10px' }}>
                      <h4>Items</h4>
                      {boqData.ItemList.map((item, index) => (
                          <div key={index} style={{ border: '1px solid #ddd', margin: '5px 0', padding: '10px' }}>
                              <strong>Item Serial Number:</strong> {item.ItemObjectId} <br />
                              <strong>Required Quantity:</strong> {item.ReqQty} <br />
                              <strong>SOR Rate:</strong> {item.SorRate} <br />
                              <strong>SOR Amount:</strong> {item.SorAmount}
                          </div>
                      ))}
                      <h4>Products</h4>
                      {boqData.ProductList.map((product, index) => (
                          <div key={index} style={{ border: '1px solid #ddd', margin: '5px 0', padding: '10px' }}>
                              <strong>Product ID:</strong> {product.Product} <br />
                              <strong>Required Quantity:</strong> {product.ReqQty} <br />
                              <strong>SOR Rate:</strong> {product.SorRate} <br />
                              <strong>SOR Amount:</strong> {product.SorAmount}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      ) : (
          <div>Loading BOQ details...</div>
      )} */}
            <h1>Site Details</h1>
            <div><strong>Tender ID:</strong> {siteData.tenderId || 'N/A'}</div>
            <div><strong>BOQ ID:</strong> {siteData.boqId || 'N/A'}</div>
            <h2>Stages</h2>
            {siteData.stages.length === 0 ? (
                <div>No stages available.</div>
            ) : (
                siteData.stages.map((stage, stageIndex) => (
                    <div key={stageIndex} style={{ border: '1px solid #ccc', margin: '20px 0', padding: '15px' }}>
                        <h3>Stage {stageIndex + 1}: {stage.stageName || 'Unnamed Stage'}</h3>
                        <div><strong>Start Date:</strong> {stage.startDate ? new Date(stage.startDate).toLocaleDateString() : 'N/A'}</div>
                        <div><strong>Duration:</strong> {stage.duration || 'N/A'} days</div>
                        <div><strong>Completed:</strong> {stage.completed ? 'Yes' : 'No'}</div>
                        <div><strong>Expected Cost:</strong> {stage.expectedCost || 'N/A'}</div>

                        <h4>Item List</h4>
                        {stage.subBoq.ItemList.length === 0 ? (
                            <div>No items available for this stage.</div>
                        ) : (
                            stage.subBoq.ItemList.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    style={{
                                        border: '1px solid #aaa',
                                        margin: '10px 0',
                                        padding: '10px',
                                    }}
                                >
                                    <strong>Item Serial Number:</strong> {item.details?.ItemSerialNo || 'N/A'} <br />
                                    <strong>Short Description:</strong> {item.details?.ShortDesc || 'N/A'} <br />
                                    <strong>Unit of Measurement:</strong> {item.details?.Uom || 'N/A'} <br />
                                    <strong>Required Quantity:</strong> {item.ReqQty || 'N/A'}
                                </div>
                            ))
                        )}

                        <h4>Product List</h4>
                        {stage.subBoq.ProductList.length === 0 ? (
                            <div>No products available for this stage.</div>
                        ) : (
                            stage.subBoq.ProductList.map((product, productIndex) => (
                                <div key={productIndex} style={{ border: '1px solid #aaa', margin: '10px 0', padding: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>Product Name:</strong> {product.details?.productName || 'N/A'} <br />
                                            <strong>Description:</strong> {product.details?.description || 'N/A'} <br />
                                            <strong>Unit:</strong> {product.details?.unit || 'N/A'}
                                        </div>
                                        <button
                                            onClick={() => toggleDropdown(stageIndex, product.Product)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            {expandedStages[stageIndex]?.[product.Product] ? 'Hide Items' : 'Show Items'}
                                        </button>
                                    </div>
                                    {expandedStages[stageIndex]?.[product.Product] && (
                                        <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px', background: '#f9f9f9' }}>
                                            <h5>Items in Product</h5>
                                            {product.details?.itemList.length === 0 ? (
                                                <div>No items available for this product.</div>
                                            ) : (
                                                product.details.itemList.map((item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        style={{
                                                            border: '1px solid #ddd',
                                                            margin: '5px 0',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        <strong>Item Serial Number:</strong> {item.details?.ItemSerialNo || 'N/A'} <br />
                                                        <strong>Short Description:</strong> {item.details?.ShortDesc || 'N/A'} <br />
                                                        <strong>Unit of Measurement:</strong> {item.details?.Uom || 'N/A'}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default SiteView;
