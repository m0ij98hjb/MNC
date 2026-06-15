export const projects = [
  {
    projectId: "MNC-001",
    projectName: "مشروع فندقي مكة",
    streams: [
      { id: 1, name: "كاميرا المدخل",         url: "http://DVR_IP/stream1",  type: "mjpeg" },
      { id: 2, name: "كاميرا الطابق الأول",    url: "http://DVR_IP/stream2",  type: "mjpeg" },
      { id: 3, name: "كاميرا الموقف",          url: "http://DVR_IP/stream3",  type: "hls"   },
      { id: 4, name: "كاميرا الخلفية",         url: "http://DVR_IP/stream4",  type: "mjpeg" },
    ],
  },
  {
    projectId: "MNC-002",
    projectName: "فيلا سكنية مكة",
    streams: [
      { id: 1, name: "كاميرا المدخل",  url: "http://DVR_IP2/stream1", type: "mjpeg" },
      { id: 2, name: "كاميرا الحديقة", url: "http://DVR_IP2/stream2", type: "mjpeg" },
    ],
  },
];
