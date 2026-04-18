const calculateEOQ = (spare) => {
  const { annualDemand, orderingCost, holdingCost, leadTimeDays } = spare;
  
  // EOQ = sqrt( (2 * D * S) / H )
  let eoq = 0;
  if(annualDemand > 0 && orderingCost > 0 && holdingCost > 0) {
    eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
  }
  
  const dailyDemand = annualDemand / 365;
  const reorderPoint = dailyDemand * leadTimeDays + (spare.minimumStock || 0);

  return {
    eoq: Math.round(eoq),
    reorderPoint: Math.round(reorderPoint),
    dailyDemand: dailyDemand.toFixed(2),
    annualDemand,
    orderingCost,
    holdingCost,
    leadTimeDays
  };
};

module.exports = { calculateEOQ } ;
