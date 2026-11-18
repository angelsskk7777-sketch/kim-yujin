function schedule(principal, annualRate, months, method, grace=0) {
  if (!Number.isFinite(principal)||principal<=0||principal>1e12||!Number.isFinite(annualRate)||annualRate<0||annualRate>100||!Number.isInteger(months)||months<1||months>600||!Number.isInteger(grace)||grace<0||grace>=months||!['equal','principal','bullet'].includes(method)) throw Error('금액·금리·기간을 확인해 주세요. 거치기간은 전체 기간보다 짧아야 합니다.');
  const r=annualRate/1200, n=months-grace;
  const fixed=r===0?principal/n:principal*r/(-Math.expm1(-n*Math.log1p(r)));
  let balance=principal; const rows=[];
  for(let m=1;m<=months;m++) {
    const interest=balance*r;
    let capital=0;
    if(method==='bullet') capital=m===months?balance:0;
    else if(m>grace) capital=m===months?balance:Math.min(balance,method==='principal'?principal/n:Math.max(0,fixed-interest));
    balance=Math.max(0,balance-capital);
    rows.push({month:m,capital,interest,payment:capital+interest,balance});
  }
  return {rows,interest:rows.reduce((a,x)=>a+x.interest,0),total:rows.reduce((a,x)=>a+x.payment,0)};
}
if(typeof module!=='undefined')module.exports={schedule};
