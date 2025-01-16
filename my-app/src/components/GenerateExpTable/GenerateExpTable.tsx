export interface ExpTableEntry {
    level: number;
    expForLevel: number;
    cumulativeExp: number;
  }
  
  export function GenerateExpTable(baseExp: number, growthRate: number, maxLevel: number): ExpTableEntry[] {
    const expTable: ExpTableEntry[] = [];
    let cumulativeExp = 0;
  
    for (let level = 1; level <= maxLevel; level++) {
      const expForLevel = Math.floor(baseExp * Math.pow(growthRate, level - 1));
      cumulativeExp += expForLevel;
      expTable.push({
        level,
        expForLevel,
        cumulativeExp,
      });
    }
  
    return expTable;
  }
  