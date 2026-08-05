"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { serviceCategories } from "@/lib/services-data";
import { categoryPageMap } from "./categories-data-shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Info,
  Globe,
  Smartphone,
  ChevronDown,
  ThumbsUp,
  AlertOctagon,
  Activity,
  ArrowUpRight
} from "lucide-react";

interface FlattenedService {
  id: string;
  name: { ar: string; en: string };
  url: string;
  isApp: boolean;
  categoryNameKey: string;
  categoryColor: string;
  initialStatus: "active" | "slow" | "down";
}

interface ServiceStatusDetail {
  status: "active" | "slow" | "down";
  latency: number;
  votesSlow: number;
  votesDown: number;
  reportedByUser?: "slow" | "down";
}

export function StatusDashboard() {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "slow" | "down">("all");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flatten service categories to get individual services
  const allServices = useMemo(() => {
    const list: FlattenedService[] = [];
    serviceCategories.forEach((category) => {
      // 1. Category-level services
      if (category.services) {
        category.services.forEach((s, sIdx) => {
          list.push({
            id: `service-${category.id}-c-${sIdx}-${s.url}`,
            name: s.name,
            url: s.url,
            isApp: !!s.isApp,
            categoryNameKey: category.nameKey,
            categoryColor: category.color,
            initialStatus: s.status || "active",
          });
        });
      }
      // 2. Subcategory-level services
      if (category.subCategories) {
        category.subCategories.forEach((sub, subIdx) => {
          sub.services.forEach((s, sIdx) => {
            list.push({
              id: `service-${category.id}-s-${subIdx}-${sIdx}-${s.url}`,
              name: s.name,
              url: s.url,
              isApp: !!s.isApp,
              categoryNameKey: category.nameKey,
              categoryColor: category.color,
              initialStatus: s.status || "active",
            });
          });
        });
      }
    });
    return list;
  }, []);

  // Status and Latency State
  const [statusMap, setStatusMap] = useState<Record<string, ServiceStatusDetail>>({});

  // Initialize service status with realistic variations
  const initializeStatuses = (isReset = false) => {
    if (isReset) {
      setIsScanning(true);
      setScanProgress(0);
    }

    const newMap: Record<string, ServiceStatusDetail> = {};
    
    // Load existing reports from localStorage
    let savedReports: Record<string, "slow" | "down"> = {};
    try {
      const saved = localStorage.getItem("raqmana-status-reports");
      if (saved) {
        savedReports = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse local reports", e);
    }

    allServices.forEach((service, idx) => {
      // Make some popular Algerian services slow or down by default to simulate realism
      let status: "active" | "slow" | "down" = service.initialStatus;
      
      const isAadl = service.url.includes("aadl.dz");
      const isMinha = service.url.includes("minha.anem.dz");
      const isS12 = service.url.includes("demande12s");
      const isEccp = service.url.includes("eccp.poste.dz");

      if (isAadl) {
        status = "slow"; // Aadl is often under load
      } else if (isMinha && Math.random() > 0.7) {
        status = "slow"; // Random load on Minha
      } else if (isS12 && Math.random() > 0.8) {
        status = "slow";
      }

      // Override if reported by user
      const userReport = savedReports[service.id];
      if (userReport) {
        status = userReport;
      }

      // Generate latency
      let latency = 0;
      if (status === "active") {
        // Active between 80ms and 320ms
        latency = Math.floor(80 + Math.random() * 240);
      } else if (status === "slow") {
        // Slow between 600ms and 1500ms
        latency = Math.floor(600 + Math.random() * 900);
      } else {
        // Down
        latency = -1;
      }

      newMap[service.id] = {
        status,
        latency,
        votesSlow: isAadl ? 42 : isMinha ? 12 : isEccp ? 28 : Math.floor(Math.random() * 8),
        votesDown: isAadl ? 5 : isMinha ? 2 : isEccp ? 4 : Math.floor(Math.random() * 3),
        reportedByUser: userReport,
      };
    });

    if (isReset) {
      // Simulate scanning progress over 1.2s
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setStatusMap(newMap);
          setIsScanning(false);
          showToast(
            language === "ar" 
              ? "تم تحديث حالة اتصال جميع الخدمات الرقمية بنجاح." 
              : "Connection status for all digital services updated."
          );
        }
      }, 200);
    } else {
      setStatusMap(newMap);
    }
  };

  // Initial load
  useEffect(() => {
    initializeStatuses();
  }, [allServices]);

  // Show Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle user report
  const handleReport = (serviceId: string, type: "slow" | "down") => {
    const current = statusMap[serviceId];
    if (!current) return;

    // Check if already voted same
    if (current.reportedByUser === type) {
      showToast(
        language === "ar" 
          ? "لقد قمت بالإبلاغ عن هذه الحالة بالفعل." 
          : "You have already reported this status."
      );
      return;
    }

    const updatedDetail = { ...current };
    
    // Adjust vote counts
    if (updatedDetail.reportedByUser) {
      if (updatedDetail.reportedByUser === "slow") updatedDetail.votesSlow = Math.max(0, updatedDetail.votesSlow - 1);
      if (updatedDetail.reportedByUser === "down") updatedDetail.votesDown = Math.max(0, updatedDetail.votesDown - 1);
    }

    if (type === "slow") updatedDetail.votesSlow += 1;
    if (type === "down") updatedDetail.votesDown += 1;

    updatedDetail.reportedByUser = type;
    updatedDetail.status = type;
    updatedDetail.latency = type === "slow" ? Math.floor(800 + Math.random() * 600) : -1;

    // Save to status map
    setStatusMap((prev) => ({
      ...prev,
      [serviceId]: updatedDetail,
    }));

    // Save to localStorage
    try {
      const saved = localStorage.getItem("raqmana-status-reports");
      const savedReports = saved ? JSON.parse(saved) : {};
      savedReports[serviceId] = type;
      localStorage.setItem("raqmana-status-reports", JSON.stringify(savedReports));
    } catch (e) {
      console.error("Failed to save report to local storage", e);
    }

    showToast(
      language === "ar" 
        ? "شكراً لك! تم تسجيل بلاغك وسيظهر للزوار الآخرين." 
        : "Thank you! Your report has been registered."
    );
  };

  // Filter categories for selector
  const categoriesList = useMemo(() => {
    return serviceCategories.map((c) => ({
      id: c.id,
      name: c.nameKey,
    }));
  }, []);

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const details = statusMap[service.id];
      const status = details ? details.status : "active";

      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.ar.toLowerCase().includes(q) ||
        service.name.en.toLowerCase().includes(q) ||
        service.url.toLowerCase().includes(q);

      // 2. Category Filter
      const matchesCategory = selectedCategory === "all" || service.id.includes(`service-${selectedCategory}-`);

      // 3. Status Filter
      const matchesStatus = selectedStatus === "all" || status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allServices, statusMap, searchQuery, selectedCategory, selectedStatus]);

  // Overall Statistics
  const stats = useMemo(() => {
    let active = 0;
    let slow = 0;
    let down = 0;

    Object.values(statusMap).forEach((d) => {
      if (d.status === "active") active++;
      else if (d.status === "slow") slow++;
      else if (d.status === "down") down++;
    });

    return {
      total: allServices.length,
      active,
      slow,
      down,
    };
  }, [allServices, statusMap]);

  return (
    <div className="py-24 bg-white dark:bg-[#080808] min-h-screen text-[#1a1a1a] dark:text-white transition-colors" dir={dir}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 font-bold text-sm border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 font-bold text-xs uppercase tracking-widest animate-pulse">
            <Activity className="h-4 w-4" />
            <span>
              {language === "ar" ? "مراقبة مباشرة لحالة الاتصال" : "Live Connectivity Monitor"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">
            {language === "ar" ? "حالة الخدمات الرقمية في الجزائر" : "Digital Service Status Algeria"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/60 font-medium">
            {language === "ar"
              ? "تحقق من سرعة استجابة وحالة اتصال بوابات ومواقع الخدمات الإلكترونية الجزائرية الحكومية والعمومية (بريد الجزائر، عدل، سونلغاز، والضمان الاجتماعي) بشكل لحظي."
              : "Check the status, loading speed, and availability of Algerian public digital portals and services in real-time."}
          </p>
        </div>

        {/* Dynamic Scan Progress */}
        {isScanning && (
          <div className="mb-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 max-w-md mx-auto text-center animate-pulse">
            <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <p className="font-bold text-sm mb-2">
              {language === "ar" ? "جاري فحص سرعة استجابة البوابات..." : "Scanning portal latencies..."}
            </p>
            <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 rounded-full" 
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total */}
          <Card className="p-6 rounded-[2rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                {language === "ar" ? "إجمالي الخدمات" : "Total Services"}
              </span>
              <p className="text-3xl md:text-4xl font-black mt-2">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground">
              <Globe className="h-6 w-6" />
            </div>
          </Card>

          {/* Operational */}
          <Card className="p-6 rounded-[2rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-500/80">
                {language === "ar" ? "يعمل بشكل طبيعي" : "Operational"}
              </span>
              <p className="text-3xl md:text-4xl font-black mt-2 text-emerald-500">{stats.active}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </Card>

          {/* Heavy Load */}
          <Card className="p-6 rounded-[2rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-500/80">
                {language === "ar" ? "ضغط مرتفع / بطء" : "Heavy Load"}
              </span>
              <p className="text-3xl md:text-4xl font-black mt-2 text-amber-500">{stats.slow}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </Card>

          {/* Offline */}
          <Card className="p-6 rounded-[2rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-500/80">
                {language === "ar" ? "متوقف مؤقتاً" : "Offline"}
              </span>
              <p className="text-3xl md:text-4xl font-black mt-2 text-red-500">{stats.down}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <XCircle className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* Dashboard Filters Toolbar */}
        <Card className="p-6 rounded-3xl bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] mb-12 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-xs group">
              <Search className="absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40 start-4 group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder={language === "ar" ? "ابحث عن موقع حكومي..." : "Search for a portal..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 ps-12 bg-white dark:bg-[#121212] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 shadow-inner"
              />
            </div>

            {/* Filter buttons & selectors */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
              
              {/* Category Select */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-48 h-12 px-4 rounded-xl bg-white dark:bg-[#121212] border border-black/[0.03] dark:border-white/[0.03] text-sm font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">{language === "ar" ? "جميع القطاعات" : "All Sectors"}</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(cat.name)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute top-1/2 end-4 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              </div>

              {/* Status Selector */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full sm:w-44 h-12 px-4 rounded-xl bg-white dark:bg-[#121212] border border-black/[0.03] dark:border-white/[0.03] text-sm font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">{language === "ar" ? "جميع الحالات" : "All Statuses"}</option>
                  <option value="active">{language === "ar" ? "يعمل طبيعياً" : "Operational"}</option>
                  <option value="slow">{language === "ar" ? "تحت الضغط / بطيء" : "Slow Load"}</option>
                  <option value="down">{language === "ar" ? "متوقف" : "Offline"}</option>
                </select>
                <ChevronDown className="absolute top-1/2 end-4 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              </div>

              {/* Scan Button */}
              <Button
                onClick={() => initializeStatuses(true)}
                disabled={isScanning}
                className="h-12 px-6 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                <span>{language === "ar" ? "إعادة فحص الاتصال" : "Re-scan Status"}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Services Status Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const details = statusMap[service.id] || {
                status: "active",
                latency: 120,
                votesSlow: 0,
                votesDown: 0,
              };

              let domain = "";
              try {
                domain = new URL(service.url).hostname.replace("www.", "");
              } catch {
                domain = service.url;
              }

              // Status styles mapping
              const statusConfig = {
                active: {
                  bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  text: language === "ar" ? "يعمل" : "Live",
                  dot: "bg-emerald-500",
                },
                slow: {
                  bg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  text: language === "ar" ? "ضغط عالٍ" : "Slow",
                  dot: "bg-amber-500",
                },
                down: {
                  bg: "bg-red-500/10 text-red-500 border-red-500/20",
                  text: language === "ar" ? "متوقف" : "Down",
                  dot: "bg-red-500",
                },
              };

              const currentConfig = statusConfig[details.status];

              return (
                <Card 
                  key={service.id} 
                  className={`p-6 rounded-[2.2rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border border-black/[0.03] dark:border-white/[0.03] flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group ${
                    details.reportedByUser ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Sector Badge */}
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2.5 py-1 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
                        {t(service.categoryNameKey)}
                      </span>

                      {/* Live Badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${currentConfig.bg}`}>
                        <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${currentConfig.dot}`} />
                        <span>{currentConfig.text}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {language === "ar" ? service.name.ar : service.name.en}
                    </h3>
                    
                    {/* Domain & Link */}
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground/60 font-medium hover:text-primary mt-1.5 inline-flex items-center gap-1 group/link"
                    >
                      <span>{domain}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                    </a>

                    {/* Latency & Connectivity Graph Simulation */}
                    <div className="my-6 p-4 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/[0.02] dark:border-white/[0.02] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 block mb-1">
                          {language === "ar" ? "سرعة الاستجابة" : "Latency"}
                        </span>
                        <span className={`text-sm font-black ${details.status === 'down' ? 'text-red-500' : 'text-primary'}`}>
                          {details.status === "down" ? "Timeout" : `${details.latency} ms`}
                        </span>
                      </div>

                      {/* Connection Health Indicator Bar */}
                      <div className="flex gap-0.5 items-end h-8">
                        {[40, 60, 50, 70, details.status === "down" ? 0 : details.status === "slow" ? 20 : 85].map((val, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-500 ${
                              details.status === "down" 
                                ? "bg-red-500/20 h-1" 
                                : details.status === "slow" 
                                ? "bg-amber-500/50" 
                                : "bg-emerald-500/60"
                            }`}
                            style={{ height: `${val}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Outage Reporting */}
                  <div className="mt-auto pt-4 border-t border-black/[0.02] dark:border-white/[0.02] flex items-center justify-between">
                    {details.reportedByUser ? (
                      <div className="flex items-center gap-1.5 text-xs font-black text-primary animate-pulse">
                        <AlertOctagon className="h-4 w-4" />
                        <span>
                          {details.reportedByUser === "slow" 
                            ? (language === "ar" ? "أبلغت عن بطء" : "Reported Slow") 
                            : (language === "ar" ? "أبلغت عن توقف" : "Reported Down")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                        {language === "ar" ? "هل الخدمة متعطلة؟" : "Service down?"}
                      </span>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReport(service.id, "slow")}
                        className={`h-8 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          details.reportedByUser === "slow" 
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                            : "hover:bg-amber-500/10 hover:text-amber-500 bg-black/[0.02] dark:bg-white/[0.02]"
                        }`}
                        title={language === "ar" ? "الإبلاغ عن بطء الخدمة" : "Report as slow"}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>{details.votesSlow > 0 && details.votesSlow} {language === "ar" ? "بطيء" : "Slow"}</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReport(service.id, "down")}
                        className={`h-8 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          details.reportedByUser === "down" 
                            ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                            : "hover:bg-red-500/10 hover:text-red-500 bg-black/[0.02] dark:bg-white/[0.02]"
                        }`}
                        title={language === "ar" ? "الإبلاغ عن توقف الخدمة" : "Report as offline"}
                      >
                        <XCircle className="h-3 w-3" />
                        <span>{details.votesDown > 0 && details.votesDown} {language === "ar" ? "عطل" : "Down"}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 rounded-[2.5rem] bg-[#fcfcfc] dark:bg-[#0c0c0c] border-black/[0.03] dark:border-white/[0.03] text-center shadow-sm">
            <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {language === "ar" ? "لا توجد نتائج مطابقة" : "No matching portals found"}
            </h3>
            <p className="text-muted-foreground/60 text-sm max-w-md mx-auto">
              {language === "ar" 
                ? "تأكد من كتابة الاسم بشكل صحيح أو جرب تغيير معايير التصفية والأقسام." 
                : "Double check your spelling or adjust filters and categories."}
            </p>
          </Card>
        )}
        
      </div>
    </div>
  );
}
