function calculateStats(stat) {
  let atkIv = (Math.random() * 26).toFixed(2);
  let defIv = (Math.random() * 26).toFixed(2);
  let spdIv = (Math.random() * 26).toFixed(2);
  let avgIv = (parseFloat(atkIv) + parseFloat(defIv) + parseFloat(spdIv)) / 3;
  avgIv = Math.round(avgIv * 100) / 100;
  avgIv = ((avgIv/25)*100).toFixed(2)
  
  let res = {
    atkIv: Math.floor(atkIv),
    defIv: Math.floor(defIv),
    spdIv: Math.floor(spdIv),
    avgIv: avgIv,
  };
  console.log(res)
  return res
}
//IV, Base, level
function getStatValue(statIv, bStat, level) {
  console.log(statIv)
    let finalStat = (((2*bStat) + statIv + (0/4)) * (level/100)) + 5;
    const stat = Math.floor((((bStat) + 2*statIv) * (level / 100)) + 5);
    return stat;
}

module.exports = { calculateStats, getStatValue };
