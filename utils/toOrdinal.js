    module.exports = (num) => {
        if (!num || isNaN(num)) return null;
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
      return `${num}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
    };