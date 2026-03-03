import React, { createContext, useContext, useState, useEffect } from 'react';
import { BagItem } from '../types';

interface BagContextType {
  items: BagItem[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  adults: number;
  childrenCount: number;
  addItem: (item: BagItem) => void;
  removeItem: (id: string) => void;
  clearBag: () => void;
  isInBag: (id: string) => boolean;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setAdults: (count: number) => void;
  setChildrenCount: (count: number) => void;
  totalItems: number;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BagItem[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBag = localStorage.getItem('serenity_bag');
    const savedStartDate = localStorage.getItem('serenity_bag_start_date');
    const savedEndDate = localStorage.getItem('serenity_bag_end_date');
    const savedAdults = localStorage.getItem('serenity_bag_adults');
    const savedChildren = localStorage.getItem('serenity_bag_children');
    
    if (savedBag) {
      try {
        setItems(JSON.parse(savedBag));
      } catch (e) {
        console.error('Failed to parse bag from localStorage', e);
      }
    }
    if (savedStartDate) setStartDate(new Date(savedStartDate));
    if (savedEndDate) setEndDate(new Date(savedEndDate));
    if (savedAdults) setAdults(parseInt(savedAdults, 10));
    if (savedChildren) setChildrenCount(parseInt(savedChildren, 10));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('serenity_bag', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (startDate) localStorage.setItem('serenity_bag_start_date', startDate.toISOString());
    else localStorage.removeItem('serenity_bag_start_date');
  }, [startDate]);

  useEffect(() => {
    if (endDate) localStorage.setItem('serenity_bag_end_date', endDate.toISOString());
    else localStorage.removeItem('serenity_bag_end_date');
  }, [endDate]);

  useEffect(() => {
    localStorage.setItem('serenity_bag_adults', adults.toString());
  }, [adults]);

  useEffect(() => {
    localStorage.setItem('serenity_bag_children', childrenCount.toString());
  }, [childrenCount]);

  const addItem = (item: BagItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearBag = () => {
    setItems([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setAdults(2);
    setChildrenCount(0);
  };

  const isInBag = (id: string) => {
    return items.some(item => item.id === id);
  };

  const totalItems = items.length;

  return (
    <BagContext.Provider value={{ 
      items, 
      startDate, 
      endDate, 
      adults, 
      childrenCount, 
      addItem, 
      removeItem, 
      clearBag, 
      isInBag, 
      setStartDate, 
      setEndDate, 
      setAdults, 
      setChildrenCount, 
      totalItems 
    }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};
