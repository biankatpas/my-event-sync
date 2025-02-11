export const convertYyyyMmDdToDdMmYyyy = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  
  export const convertDdMmYyyyToYyyyMmDd = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };
  
  export const getTitleBackgroundColor = (guest) => {
    if (!guest) return 'transparent';
    const normalizedGuest = guest
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    switch (normalizedGuest) {
      case 'joao':
        return "#228B22";
      case 'bianka':
        return "#1E90FF";
      case 'angelita':
        return "#9370DB";
      case 'mel':
        return "#D81B60";
      default:
        return "#696969";
    }
  };
  
  export const getCardBackgroundColor = (eventDate) => {
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0];
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
    const dayAfterTomorrowDate = new Date(todayDate);
    dayAfterTomorrowDate.setDate(todayDate.getDate() + 2);
    const dayAfterTomorrowStr = dayAfterTomorrowDate.toISOString().split('T')[0];
  
    if (eventDate < today) {
      return "#fafafa";
    } else if (eventDate === today) {
      return "#e8f5e9";
    } else if (eventDate === tomorrowStr) {
      return "#ffcdd2";
    } else if (eventDate === dayAfterTomorrowStr) {
      return "#fff9c4";
    } else {
      return "#f2f2f2";
    }
  };
  