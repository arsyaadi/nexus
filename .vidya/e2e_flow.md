# okf - End-to-End System Core Flow

> ⚠️ **Draft E2E System Documentation**
>
> Dokumen ini dihasilkan secara otomatis dari analisis AST Knowledge Graph untuk menampilkan alur bisnis dan arsitektur sistem dari awal hingga akhir.

---

# 1. Ringkasan Sistem & Alur Utama

Dokumen ini menyatukan seluruh kapabilitas, modul, komponen, dan berkas di dalam sistem **okf** ke dalam satu diagram alur dan penjelasan terstruktur.

Total Node Terdeteksi: **178** | Total Relasi Antar Komponen: **231**

---

# 2. Master End-to-End Flowchart

```mermaid
flowchart TD
    N1[".gitignore (File)"]
    N2[".mcp.json (File)"]
    N3["_gitignore.md (File)"]
    N4["_mcp_json.md (File)"]
    N5["agents_md.md (File)"]
    N6["analyzer.md (File)"]
    N7["codebaseanalyzer.md (File)"]
    N8["defaultmarkdownrenderadapter.md (File)"]
    N9["docgenerator.md (File)"]
    N10["docusaurusexporter.md (File)"]
    N11["docusaurusexporter_ts.md (File)"]
    N12["docxexporter.md (File)"]
    N13["docxexporter_ts.md (File)"]
    N14["e2eflowgenerator.md (File)"]
    N15["e2eflowgenerator_ts.md (File)"]
    N16["e2eflowoutput.md (File)"]
    N17["executionplan.md (File)"]
    N18["filesystemvidyawriter.md (File)"]
    N19["graphedge.md (File)"]
    N20["graphnode.md (File)"]
    N21["graphprovider.md (File)"]
    N22["index_ts.md (File)"]
    N23["knowledgegraph.md (File)"]
    N24["loader_ts.md (File)"]
    N25["loadvidyapackage.md (File)"]
    N26["localgraphprovider.md (File)"]
    N27["localgraphprovider_ts.md (File)"]
    N28["main.md (File)"]
    N29["markdowndocgenerator.md (File)"]
    N30["moduledocoutput.md (File)"]
    N31["moduleexecutor.md (File)"]
    N32["moduleplanner.md (File)"]
    N33["moduletask.md (File)"]
    N34["moduleworker.md (File)"]
    N35["okf.md (File)"]
    N36["package-lock_json.md (File)"]
    N37["package_json.md (File)"]
    N38["placeholderuserre.md (File)"]
    N39["planner.md (File)"]
    N40["principles_md.md (File)"]
    N41["project_md.md (File)"]
    N42["readme_md.md (File)"]
    N43["renderadapter.md (File)"]
    N44["runserver.md (File)"]
    N45["storage.md (File)"]
    N46["taskexecutor.md (File)"]
    N47["taskworker.md (File)"]
    N48["tsconfig_json.md (File)"]
    N49["userreview.md (File)"]
    N50["vidyaexporter.md (File)"]
    N51["vidyaexporteroptions.md (File)"]
    N52["vidyametadata.md (File)"]
    N53["vidyapackagedata.md (File)"]
    N54["vidyastorage.md (File)"]
    N55["vidyaworkfloworchestrator.md (File)"]
    N56["vidyawriter.md (File)"]
    N57["workerinput.md (File)"]
    N58["workflowoptions.md (File)"]
    N59["e2e_flow.md (File)"]
    N60["metadata.json (File)"]
    N61["_gitignore.md (File)"]
    N62["_mcp_json.md (File)"]
    N63["agents_md.md (File)"]
    N64["analyzer.md (File)"]
    N65["codebaseanalyzer.md (File)"]
    N66["defaultmarkdownrenderadapter.md (File)"]
    N67["docgenerator.md (File)"]
    N68["docusaurusexporter.md (File)"]
    N69["docusaurusexporter_ts.md (File)"]
    N70["docxexporter.md (File)"]
    N71["docxexporter_ts.md (File)"]
    N72["e2eflowgenerator.md (File)"]
    N73["e2eflowgenerator_ts.md (File)"]
    N74["e2eflowoutput.md (File)"]
    N75["executionplan.md (File)"]
    N76["filesystemvidyawriter.md (File)"]
    N77["graphedge.md (File)"]
    N78["graphnode.md (File)"]
    N79["graphprovider.md (File)"]
    N80["index_ts.md (File)"]
    N81["knowledgegraph.md (File)"]
    N82["loader_ts.md (File)"]
    N83["loadvidyapackage.md (File)"]
    N84["localgraphprovider.md (File)"]
    N85["localgraphprovider_ts.md (File)"]
    N86["main.md (File)"]
    N87["markdowndocgenerator.md (File)"]
    N88["moduledocoutput.md (File)"]
    N89["moduleexecutor.md (File)"]
    N90["moduleplanner.md (File)"]
    N91["moduletask.md (File)"]
    N92["moduleworker.md (File)"]
    N93["okf.md (File)"]
    N94["package-lock_json.md (File)"]
    N95["package_json.md (File)"]
    N96["placeholderuserre.md (File)"]
    N97["planner.md (File)"]
    N98["principles_md.md (File)"]
    N99["project_md.md (File)"]
    N100["readme_md.md (File)"]
    N101["renderadapter.md (File)"]
    N102["runserver.md (File)"]
    N103["storage.md (File)"]
    N104["taskexecutor.md (File)"]
    N105["taskworker.md (File)"]
    N106["tsconfig_json.md (File)"]
    N107["userreview.md (File)"]
    N108["vidyaexporter.md (File)"]
    N109["vidyaexporteroptions.md (File)"]
    N110["vidyametadata.md (File)"]
    N111["vidyapackagedata.md (File)"]
    N112["vidyastorage.md (File)"]
    N113["vidyaworkfloworchestrator.md (File)"]
    N114["vidyawriter.md (File)"]
    N115["workerinput.md (File)"]
    N116["workflowoptions.md (File)"]
    N117["AGENTS.md (File)"]
    N118["PRINCIPLES.md (File)"]
    N119["PROJECT.md (File)"]
    N120["README.md (File)"]
    N121["package-lock.json (File)"]
    N122["package.json (File)"]
    N123["index.ts (File)"]
    N124["Analyzer (Interface)"]
    N125["CodebaseAnalyzer (Class)"]
    N126["localGraphProvider.ts (File)"]
    N127["LocalGraphProvider (Class)"]
    N128["index.ts (File)"]
    N129["WorkerInput (Interface)"]
    N130["TaskWorker (Interface)"]
    N131["ModuleWorker (Class)"]
    N132["TaskExecutor (Interface)"]
    N133["ModuleExecutor (Class)"]
    N134["docusaurusExporter.ts (File)"]
    N135["DocusaurusExporter (Class)"]
    N136["docxExporter.ts (File)"]
    N137["DocxExporter (Class)"]
    N138["index.ts (File)"]
    N139["NexusExporterOptions (Interface)"]
    N140["NexusExporter (Interface)"]
    N141["NexusPackageData (Interface)"]
    N142["loader.ts (File)"]
    N143["loadNexusPackage (Function)"]
    N144["index.ts (File)"]
    N145["DocGenerator (Interface)"]
    N146["MarkdownDocGenerator (Class)"]
    N147["index.ts (File)"]
    N148["main (Function)"]
    N149["index.ts (File)"]
    N150["runServer (Function)"]
    N151["e2eFlowGenerator.ts (File)"]
    N152["E2EFlowOutput (Interface)"]
    N153["E2EFlowGenerator (Class)"]
    N154["index.ts (File)"]
    N155["Planner (Interface)"]
    N156["ModulePlanner (Class)"]
    N157["index.ts (File)"]
    N158["RenderAdapter (Interface)"]
    N159["DefaultMarkdownRenderAdapter (Class)"]
    N160["NexusWriter (Interface)"]
    N161["FileSystemNexusWriter (Class)"]
    N162["StorageManager (Interface)"]
    N163["NexusStorage (Class)"]
    N164["index.ts (File)"]
    N165["GraphNode (Interface)"]
    N166["GraphEdge (Interface)"]
    N167["KnowledgeGraph (Interface)"]
    N168["ModuleTask (Interface)"]
    N169["GraphProvider (Interface)"]
    N170["ExecutionPlan (Interface)"]
    N171["UserReviewHandler (Interface)"]
    N172["ModuleDocOutput (Interface)"]
    N173["NexusMetadata (Interface)"]
    N174["index.ts (File)"]
    N175["PlaceholderUserReview (Class)"]
    N176["WorkflowOptions (Interface)"]
    N177["NexusWorkflowOrchestrator (Class)"]
    N178["tsconfig.json (File)"]
    N123 -->|"DEFINES"| N124
    N123 -->|"DEFINES"| N125
    N126 -->|"DEFINES"| N127
    N128 -->|"DEFINES"| N129
    N128 -->|"DEFINES"| N130
    N128 -->|"DEFINES"| N131
    N128 -->|"DEFINES"| N132
    N128 -->|"DEFINES"| N133
    N134 -->|"DEFINES"| N135
    N136 -->|"DEFINES"| N137
    N138 -->|"DEFINES"| N139
    N138 -->|"DEFINES"| N140
    N138 -->|"DEFINES"| N141
    N142 -->|"DEFINES"| N143
    N144 -->|"DEFINES"| N145
    N144 -->|"DEFINES"| N146
    N147 -->|"DEFINES"| N148
    N149 -->|"DEFINES"| N150
    N151 -->|"DEFINES"| N152
    N151 -->|"DEFINES"| N153
    N154 -->|"DEFINES"| N155
    N154 -->|"DEFINES"| N156
    N157 -->|"DEFINES"| N158
    N157 -->|"DEFINES"| N159
    N157 -->|"DEFINES"| N160
    N157 -->|"DEFINES"| N161
    N157 -->|"DEFINES"| N162
    N157 -->|"DEFINES"| N163
    N164 -->|"DEFINES"| N165
    N164 -->|"DEFINES"| N166
    N164 -->|"DEFINES"| N167
    N164 -->|"DEFINES"| N168
    N164 -->|"DEFINES"| N169
    N164 -->|"DEFINES"| N170
    N164 -->|"DEFINES"| N171
    N164 -->|"DEFINES"| N172
    N164 -->|"DEFINES"| N173
    N174 -->|"DEFINES"| N175
    N174 -->|"DEFINES"| N176
    N174 -->|"DEFINES"| N177
```

---

# 3. Penjelasan Rinci Alur Komponen

### 1. .gitignore (`File`)
- **Lokasi Berkas**: `.gitignore`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 2. .mcp.json (`File`)
- **Lokasi Berkas**: `.mcp.json`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 3. _gitignore.md (`File`)
- **Lokasi Berkas**: `.vidya/business/_gitignore.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 4. _mcp_json.md (`File`)
- **Lokasi Berkas**: `.vidya/business/_mcp_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 5. agents_md.md (`File`)
- **Lokasi Berkas**: `.vidya/business/agents_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 6. analyzer.md (`File`)
- **Lokasi Berkas**: `.vidya/business/analyzer.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 7. codebaseanalyzer.md (`File`)
- **Lokasi Berkas**: `.vidya/business/codebaseanalyzer.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 8. defaultmarkdownrenderadapter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/defaultmarkdownrenderadapter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 9. docgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/business/docgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 10. docusaurusexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/docusaurusexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 11. docusaurusexporter_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/docusaurusexporter_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 12. docxexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/docxexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 13. docxexporter_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/docxexporter_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 14. e2eflowgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/business/e2eflowgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 15. e2eflowgenerator_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/e2eflowgenerator_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 16. e2eflowoutput.md (`File`)
- **Lokasi Berkas**: `.vidya/business/e2eflowoutput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 17. executionplan.md (`File`)
- **Lokasi Berkas**: `.vidya/business/executionplan.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 18. filesystemvidyawriter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/filesystemvidyawriter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 19. graphedge.md (`File`)
- **Lokasi Berkas**: `.vidya/business/graphedge.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 20. graphnode.md (`File`)
- **Lokasi Berkas**: `.vidya/business/graphnode.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 21. graphprovider.md (`File`)
- **Lokasi Berkas**: `.vidya/business/graphprovider.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 22. index_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/index_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 23. knowledgegraph.md (`File`)
- **Lokasi Berkas**: `.vidya/business/knowledgegraph.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 24. loader_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/loader_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 25. loadvidyapackage.md (`File`)
- **Lokasi Berkas**: `.vidya/business/loadvidyapackage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 26. localgraphprovider.md (`File`)
- **Lokasi Berkas**: `.vidya/business/localgraphprovider.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 27. localgraphprovider_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/business/localgraphprovider_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 28. main.md (`File`)
- **Lokasi Berkas**: `.vidya/business/main.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 29. markdowndocgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/business/markdowndocgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 30. moduledocoutput.md (`File`)
- **Lokasi Berkas**: `.vidya/business/moduledocoutput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 31. moduleexecutor.md (`File`)
- **Lokasi Berkas**: `.vidya/business/moduleexecutor.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 32. moduleplanner.md (`File`)
- **Lokasi Berkas**: `.vidya/business/moduleplanner.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 33. moduletask.md (`File`)
- **Lokasi Berkas**: `.vidya/business/moduletask.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 34. moduleworker.md (`File`)
- **Lokasi Berkas**: `.vidya/business/moduleworker.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 35. okf.md (`File`)
- **Lokasi Berkas**: `.vidya/business/okf.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 36. package-lock_json.md (`File`)
- **Lokasi Berkas**: `.vidya/business/package-lock_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 37. package_json.md (`File`)
- **Lokasi Berkas**: `.vidya/business/package_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 38. placeholderuserre.md (`File`)
- **Lokasi Berkas**: `.vidya/business/placeholderuserre.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 39. planner.md (`File`)
- **Lokasi Berkas**: `.vidya/business/planner.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 40. principles_md.md (`File`)
- **Lokasi Berkas**: `.vidya/business/principles_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 41. project_md.md (`File`)
- **Lokasi Berkas**: `.vidya/business/project_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 42. readme_md.md (`File`)
- **Lokasi Berkas**: `.vidya/business/readme_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 43. renderadapter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/renderadapter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 44. runserver.md (`File`)
- **Lokasi Berkas**: `.vidya/business/runserver.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 45. storage.md (`File`)
- **Lokasi Berkas**: `.vidya/business/storage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 46. taskexecutor.md (`File`)
- **Lokasi Berkas**: `.vidya/business/taskexecutor.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 47. taskworker.md (`File`)
- **Lokasi Berkas**: `.vidya/business/taskworker.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 48. tsconfig_json.md (`File`)
- **Lokasi Berkas**: `.vidya/business/tsconfig_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 49. userreview.md (`File`)
- **Lokasi Berkas**: `.vidya/business/userreview.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 50. vidyaexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyaexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 51. vidyaexporteroptions.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyaexporteroptions.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 52. vidyametadata.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyametadata.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 53. vidyapackagedata.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyapackagedata.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 54. vidyastorage.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyastorage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 55. vidyaworkfloworchestrator.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyaworkfloworchestrator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 56. vidyawriter.md (`File`)
- **Lokasi Berkas**: `.vidya/business/vidyawriter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 57. workerinput.md (`File`)
- **Lokasi Berkas**: `.vidya/business/workerinput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 58. workflowoptions.md (`File`)
- **Lokasi Berkas**: `.vidya/business/workflowoptions.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 59. e2e_flow.md (`File`)
- **Lokasi Berkas**: `.vidya/e2e_flow.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 60. metadata.json (`File`)
- **Lokasi Berkas**: `.vidya/metadata.json`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 61. _gitignore.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/_gitignore.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 62. _mcp_json.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/_mcp_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 63. agents_md.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/agents_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 64. analyzer.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/analyzer.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 65. codebaseanalyzer.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/codebaseanalyzer.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 66. defaultmarkdownrenderadapter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/defaultmarkdownrenderadapter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 67. docgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/docgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 68. docusaurusexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/docusaurusexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 69. docusaurusexporter_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/docusaurusexporter_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 70. docxexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/docxexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 71. docxexporter_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/docxexporter_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 72. e2eflowgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/e2eflowgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 73. e2eflowgenerator_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/e2eflowgenerator_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 74. e2eflowoutput.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/e2eflowoutput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 75. executionplan.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/executionplan.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 76. filesystemvidyawriter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/filesystemvidyawriter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 77. graphedge.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/graphedge.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 78. graphnode.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/graphnode.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 79. graphprovider.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/graphprovider.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 80. index_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/index_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 81. knowledgegraph.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/knowledgegraph.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 82. loader_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/loader_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 83. loadvidyapackage.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/loadvidyapackage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 84. localgraphprovider.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/localgraphprovider.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 85. localgraphprovider_ts.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/localgraphprovider_ts.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 86. main.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/main.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 87. markdowndocgenerator.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/markdowndocgenerator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 88. moduledocoutput.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/moduledocoutput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 89. moduleexecutor.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/moduleexecutor.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 90. moduleplanner.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/moduleplanner.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 91. moduletask.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/moduletask.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 92. moduleworker.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/moduleworker.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 93. okf.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/okf.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 94. package-lock_json.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/package-lock_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 95. package_json.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/package_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 96. placeholderuserre.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/placeholderuserre.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 97. planner.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/planner.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 98. principles_md.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/principles_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 99. project_md.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/project_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 100. readme_md.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/readme_md.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 101. renderadapter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/renderadapter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 102. runserver.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/runserver.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 103. storage.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/storage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 104. taskexecutor.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/taskexecutor.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 105. taskworker.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/taskworker.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 106. tsconfig_json.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/tsconfig_json.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 107. userreview.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/userreview.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 108. vidyaexporter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyaexporter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 109. vidyaexporteroptions.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyaexporteroptions.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 110. vidyametadata.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyametadata.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 111. vidyapackagedata.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyapackagedata.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 112. vidyastorage.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyastorage.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 113. vidyaworkfloworchestrator.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyaworkfloworchestrator.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 114. vidyawriter.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/vidyawriter.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 115. workerinput.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/workerinput.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 116. workflowoptions.md (`File`)
- **Lokasi Berkas**: `.vidya/technical/workflowoptions.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 117. AGENTS.md (`File`)
- **Lokasi Berkas**: `AGENTS.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 118. PRINCIPLES.md (`File`)
- **Lokasi Berkas**: `PRINCIPLES.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 119. PROJECT.md (`File`)
- **Lokasi Berkas**: `PROJECT.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 120. README.md (`File`)
- **Lokasi Berkas**: `README.md`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 121. package-lock.json (`File`)
- **Lokasi Berkas**: `package-lock.json`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 122. package.json (`File`)
- **Lokasi Berkas**: `package.json`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

### 123. index.ts (`File`)
- **Lokasi Berkas**: `src/analyzer/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `./localGraphProvider.js`, `src/analyzer/index.ts#interface#Analyzer`, `src/analyzer/index.ts#class#CodebaseAnalyzer`

### 124. Analyzer (`Interface`)
- **Lokasi Berkas**: `src/analyzer/index.ts`
- **Komponen Masuk (Incoming)**: `src/analyzer/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 125. CodebaseAnalyzer (`Class`)
- **Lokasi Berkas**: `src/analyzer/index.ts`
- **Komponen Masuk (Incoming)**: `src/analyzer/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 126. localGraphProvider.ts (`File`)
- **Lokasi Berkas**: `src/analyzer/localGraphProvider.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:fs/promises`, `node:path`, `typescript`, `../types/index.js`, `src/analyzer/localGraphProvider.ts#class#LocalGraphProvider`

### 127. LocalGraphProvider (`Class`)
- **Lokasi Berkas**: `src/analyzer/localGraphProvider.ts`
- **Komponen Masuk (Incoming)**: `src/analyzer/localGraphProvider.ts`
- **Komponen Keluar (Outgoing)**: None

### 128. index.ts (`File`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `src/executor/index.ts#interface#WorkerInput`, `src/executor/index.ts#interface#TaskWorker`, `src/executor/index.ts#class#ModuleWorker`, `src/executor/index.ts#interface#TaskExecutor`, `src/executor/index.ts#class#ModuleExecutor`

### 129. WorkerInput (`Interface`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `src/executor/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 130. TaskWorker (`Interface`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `src/executor/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 131. ModuleWorker (`Class`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `src/executor/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 132. TaskExecutor (`Interface`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `src/executor/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 133. ModuleExecutor (`Class`)
- **Lokasi Berkas**: `src/executor/index.ts`
- **Komponen Masuk (Incoming)**: `src/executor/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 134. docusaurusExporter.ts (`File`)
- **Lokasi Berkas**: `src/exporter/docusaurusExporter.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:fs/promises`, `node:path`, `./index.js`, `./loader.js`, `src/exporter/docusaurusExporter.ts#class#DocusaurusExporter`

### 135. DocusaurusExporter (`Class`)
- **Lokasi Berkas**: `src/exporter/docusaurusExporter.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/docusaurusExporter.ts`
- **Komponen Keluar (Outgoing)**: None

### 136. docxExporter.ts (`File`)
- **Lokasi Berkas**: `src/exporter/docxExporter.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:fs/promises`, `node:path`, `docx`, `./index.js`, `./loader.js`, `src/exporter/docxExporter.ts#class#DocxExporter`

### 137. DocxExporter (`Class`)
- **Lokasi Berkas**: `src/exporter/docxExporter.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/docxExporter.ts`
- **Komponen Keluar (Outgoing)**: None

### 138. index.ts (`File`)
- **Lokasi Berkas**: `src/exporter/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `src/exporter/index.ts#interface#NexusExporterOptions`, `src/exporter/index.ts#interface#NexusExporter`, `src/exporter/index.ts#interface#NexusPackageData`

### 139. NexusExporterOptions (`Interface`)
- **Lokasi Berkas**: `src/exporter/index.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 140. NexusExporter (`Interface`)
- **Lokasi Berkas**: `src/exporter/index.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 141. NexusPackageData (`Interface`)
- **Lokasi Berkas**: `src/exporter/index.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 142. loader.ts (`File`)
- **Lokasi Berkas**: `src/exporter/loader.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:fs/promises`, `node:path`, `./index.js`, `../types/index.js`, `src/exporter/loader.ts#func#loadNexusPackage`

### 143. loadNexusPackage (`Function`)
- **Lokasi Berkas**: `src/exporter/loader.ts`
- **Komponen Masuk (Incoming)**: `src/exporter/loader.ts`
- **Komponen Keluar (Outgoing)**: None

### 144. index.ts (`File`)
- **Lokasi Berkas**: `src/generator/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `src/generator/index.ts#interface#DocGenerator`, `src/generator/index.ts#class#MarkdownDocGenerator`

### 145. DocGenerator (`Interface`)
- **Lokasi Berkas**: `src/generator/index.ts`
- **Komponen Masuk (Incoming)**: `src/generator/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 146. MarkdownDocGenerator (`Class`)
- **Lokasi Berkas**: `src/generator/index.ts`
- **Komponen Masuk (Incoming)**: `src/generator/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 147. index.ts (`File`)
- **Lokasi Berkas**: `src/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:path`, `./analyzer/index.js`, `./planner/index.js`, `./executor/index.js`, `./storage/index.js`, `./workflow/index.js`, `./exporter/docusaurusExporter.js`, `./exporter/docxExporter.js`, `src/index.ts#func#main`

### 148. main (`Function`)
- **Lokasi Berkas**: `src/index.ts`
- **Komponen Masuk (Incoming)**: `src/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 149. index.ts (`File`)
- **Lokasi Berkas**: `src/mcp/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `@modelcontextprotocol/sdk/server/index.js`, `@modelcontextprotocol/sdk/server/stdio.js`, `@modelcontextprotocol/sdk/types.js`, `node:path`, `node:fs/promises`, `../analyzer/index.js`, `../planner/index.js`, `../storage/index.js`, `../storage/index.js`, `../types/index.js`, `../exporter/docusaurusExporter.js`, `../exporter/docxExporter.js`, `src/mcp/index.ts#func#runServer`

### 150. runServer (`Function`)
- **Lokasi Berkas**: `src/mcp/index.ts`
- **Komponen Masuk (Incoming)**: `src/mcp/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 151. e2eFlowGenerator.ts (`File`)
- **Lokasi Berkas**: `src/planner/e2eFlowGenerator.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `src/planner/e2eFlowGenerator.ts#interface#E2EFlowOutput`, `src/planner/e2eFlowGenerator.ts#class#E2EFlowGenerator`

### 152. E2EFlowOutput (`Interface`)
- **Lokasi Berkas**: `src/planner/e2eFlowGenerator.ts`
- **Komponen Masuk (Incoming)**: `src/planner/e2eFlowGenerator.ts`
- **Komponen Keluar (Outgoing)**: None

### 153. E2EFlowGenerator (`Class`)
- **Lokasi Berkas**: `src/planner/e2eFlowGenerator.ts`
- **Komponen Masuk (Incoming)**: `src/planner/e2eFlowGenerator.ts`
- **Komponen Keluar (Outgoing)**: None

### 154. index.ts (`File`)
- **Lokasi Berkas**: `src/planner/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `../types/index.js`, `./e2eFlowGenerator.js`, `src/planner/index.ts#interface#Planner`, `src/planner/index.ts#class#ModulePlanner`

### 155. Planner (`Interface`)
- **Lokasi Berkas**: `src/planner/index.ts`
- **Komponen Masuk (Incoming)**: `src/planner/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 156. ModulePlanner (`Class`)
- **Lokasi Berkas**: `src/planner/index.ts`
- **Komponen Masuk (Incoming)**: `src/planner/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 157. index.ts (`File`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:fs/promises`, `node:path`, `../types/index.js`, `src/storage/index.ts#interface#RenderAdapter`, `src/storage/index.ts#class#DefaultMarkdownRenderAdapter`, `src/storage/index.ts#interface#NexusWriter`, `src/storage/index.ts#class#FileSystemNexusWriter`, `src/storage/index.ts#interface#StorageManager`, `src/storage/index.ts#class#NexusStorage`

### 158. RenderAdapter (`Interface`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 159. DefaultMarkdownRenderAdapter (`Class`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 160. NexusWriter (`Interface`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 161. FileSystemNexusWriter (`Class`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 162. StorageManager (`Interface`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 163. NexusStorage (`Class`)
- **Lokasi Berkas**: `src/storage/index.ts`
- **Komponen Masuk (Incoming)**: `src/storage/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 164. index.ts (`File`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `src/types/index.ts#interface#GraphNode`, `src/types/index.ts#interface#GraphEdge`, `src/types/index.ts#interface#KnowledgeGraph`, `src/types/index.ts#interface#ModuleTask`, `src/types/index.ts#interface#GraphProvider`, `src/types/index.ts#interface#ExecutionPlan`, `src/types/index.ts#interface#UserReviewHandler`, `src/types/index.ts#interface#ModuleDocOutput`, `src/types/index.ts#interface#NexusMetadata`

### 165. GraphNode (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 166. GraphEdge (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 167. KnowledgeGraph (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 168. ModuleTask (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 169. GraphProvider (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 170. ExecutionPlan (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 171. UserReviewHandler (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 172. ModuleDocOutput (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 173. NexusMetadata (`Interface`)
- **Lokasi Berkas**: `src/types/index.ts`
- **Komponen Masuk (Incoming)**: `src/types/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 174. index.ts (`File`)
- **Lokasi Berkas**: `src/workflow/index.ts`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: `node:path`, `../types/index.js`, `../executor/index.js`, `../planner/index.js`, `../storage/index.js`, `src/workflow/index.ts#class#PlaceholderUserReview`, `src/workflow/index.ts#interface#WorkflowOptions`, `src/workflow/index.ts#class#NexusWorkflowOrchestrator`

### 175. PlaceholderUserReview (`Class`)
- **Lokasi Berkas**: `src/workflow/index.ts`
- **Komponen Masuk (Incoming)**: `src/workflow/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 176. WorkflowOptions (`Interface`)
- **Lokasi Berkas**: `src/workflow/index.ts`
- **Komponen Masuk (Incoming)**: `src/workflow/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 177. NexusWorkflowOrchestrator (`Class`)
- **Lokasi Berkas**: `src/workflow/index.ts`
- **Komponen Masuk (Incoming)**: `src/workflow/index.ts`
- **Komponen Keluar (Outgoing)**: None

### 178. tsconfig.json (`File`)
- **Lokasi Berkas**: `tsconfig.json`
- **Komponen Masuk (Incoming)**: `/Users/arsya/Desktop/projects/okf`
- **Komponen Keluar (Outgoing)**: None

---

# 4. Matrix Relasi Komponen

| Sumber (Source) | Tipe Relasi | Target |
|-----------------|-------------|--------|
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.gitignore` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.mcp.json` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/_gitignore.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/_mcp_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/agents_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/analyzer.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/codebaseanalyzer.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/defaultmarkdownrenderadapter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/docgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/docusaurusexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/docusaurusexporter_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/docxexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/docxexporter_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/e2eflowgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/e2eflowgenerator_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/e2eflowoutput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/executionplan.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/filesystemvidyawriter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/graphedge.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/graphnode.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/graphprovider.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/index_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/knowledgegraph.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/loader_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/loadvidyapackage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/localgraphprovider.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/localgraphprovider_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/main.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/markdowndocgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/moduledocoutput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/moduleexecutor.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/moduleplanner.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/moduletask.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/moduleworker.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/okf.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/package-lock_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/package_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/placeholderuserre.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/planner.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/principles_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/project_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/readme_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/renderadapter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/runserver.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/storage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/taskexecutor.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/taskworker.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/tsconfig_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/userreview.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyaexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyaexporteroptions.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyametadata.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyapackagedata.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyastorage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyaworkfloworchestrator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/vidyawriter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/workerinput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/business/workflowoptions.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/e2e_flow.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/metadata.json` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/_gitignore.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/_mcp_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/agents_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/analyzer.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/codebaseanalyzer.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/defaultmarkdownrenderadapter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/docgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/docusaurusexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/docusaurusexporter_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/docxexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/docxexporter_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/e2eflowgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/e2eflowgenerator_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/e2eflowoutput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/executionplan.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/filesystemvidyawriter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/graphedge.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/graphnode.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/graphprovider.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/index_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/knowledgegraph.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/loader_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/loadvidyapackage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/localgraphprovider.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/localgraphprovider_ts.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/main.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/markdowndocgenerator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/moduledocoutput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/moduleexecutor.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/moduleplanner.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/moduletask.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/moduleworker.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/okf.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/package-lock_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/package_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/placeholderuserre.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/planner.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/principles_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/project_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/readme_md.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/renderadapter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/runserver.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/storage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/taskexecutor.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/taskworker.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/tsconfig_json.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/userreview.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyaexporter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyaexporteroptions.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyametadata.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyapackagedata.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyastorage.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyaworkfloworchestrator.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/vidyawriter.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/workerinput.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `.vidya/technical/workflowoptions.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `AGENTS.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `PRINCIPLES.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `PROJECT.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `README.md` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `package-lock.json` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `package.json` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/analyzer/index.ts` |
| `src/analyzer/index.ts` | IMPORTS | `../types/index.js` |
| `src/analyzer/index.ts` | IMPORTS | `./localGraphProvider.js` |
| `src/analyzer/index.ts` | DEFINES | `src/analyzer/index.ts#interface#Analyzer` |
| `src/analyzer/index.ts` | DEFINES | `src/analyzer/index.ts#class#CodebaseAnalyzer` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/analyzer/localGraphProvider.ts` |
| `src/analyzer/localGraphProvider.ts` | IMPORTS | `node:fs/promises` |
| `src/analyzer/localGraphProvider.ts` | IMPORTS | `node:path` |
| `src/analyzer/localGraphProvider.ts` | IMPORTS | `typescript` |
| `src/analyzer/localGraphProvider.ts` | IMPORTS | `../types/index.js` |
| `src/analyzer/localGraphProvider.ts` | DEFINES | `src/analyzer/localGraphProvider.ts#class#LocalGraphProvider` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/executor/index.ts` |
| `src/executor/index.ts` | IMPORTS | `../types/index.js` |
| `src/executor/index.ts` | DEFINES | `src/executor/index.ts#interface#WorkerInput` |
| `src/executor/index.ts` | DEFINES | `src/executor/index.ts#interface#TaskWorker` |
| `src/executor/index.ts` | DEFINES | `src/executor/index.ts#class#ModuleWorker` |
| `src/executor/index.ts` | DEFINES | `src/executor/index.ts#interface#TaskExecutor` |
| `src/executor/index.ts` | DEFINES | `src/executor/index.ts#class#ModuleExecutor` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/exporter/docusaurusExporter.ts` |
| `src/exporter/docusaurusExporter.ts` | IMPORTS | `node:fs/promises` |
| `src/exporter/docusaurusExporter.ts` | IMPORTS | `node:path` |
| `src/exporter/docusaurusExporter.ts` | IMPORTS | `./index.js` |
| `src/exporter/docusaurusExporter.ts` | IMPORTS | `./loader.js` |
| `src/exporter/docusaurusExporter.ts` | DEFINES | `src/exporter/docusaurusExporter.ts#class#DocusaurusExporter` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/exporter/docxExporter.ts` |
| `src/exporter/docxExporter.ts` | IMPORTS | `node:fs/promises` |
| `src/exporter/docxExporter.ts` | IMPORTS | `node:path` |
| `src/exporter/docxExporter.ts` | IMPORTS | `docx` |
| `src/exporter/docxExporter.ts` | IMPORTS | `./index.js` |
| `src/exporter/docxExporter.ts` | IMPORTS | `./loader.js` |
| `src/exporter/docxExporter.ts` | DEFINES | `src/exporter/docxExporter.ts#class#DocxExporter` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/exporter/index.ts` |
| `src/exporter/index.ts` | IMPORTS | `../types/index.js` |
| `src/exporter/index.ts` | DEFINES | `src/exporter/index.ts#interface#NexusExporterOptions` |
| `src/exporter/index.ts` | DEFINES | `src/exporter/index.ts#interface#NexusExporter` |
| `src/exporter/index.ts` | DEFINES | `src/exporter/index.ts#interface#NexusPackageData` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/exporter/loader.ts` |
| `src/exporter/loader.ts` | IMPORTS | `node:fs/promises` |
| `src/exporter/loader.ts` | IMPORTS | `node:path` |
| `src/exporter/loader.ts` | IMPORTS | `./index.js` |
| `src/exporter/loader.ts` | IMPORTS | `../types/index.js` |
| `src/exporter/loader.ts` | DEFINES | `src/exporter/loader.ts#func#loadNexusPackage` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/generator/index.ts` |
| `src/generator/index.ts` | IMPORTS | `../types/index.js` |
| `src/generator/index.ts` | DEFINES | `src/generator/index.ts#interface#DocGenerator` |
| `src/generator/index.ts` | DEFINES | `src/generator/index.ts#class#MarkdownDocGenerator` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/index.ts` |
| `src/index.ts` | IMPORTS | `node:path` |
| `src/index.ts` | IMPORTS | `./analyzer/index.js` |
| `src/index.ts` | IMPORTS | `./planner/index.js` |
| `src/index.ts` | IMPORTS | `./executor/index.js` |
| `src/index.ts` | IMPORTS | `./storage/index.js` |
| `src/index.ts` | IMPORTS | `./workflow/index.js` |
| `src/index.ts` | IMPORTS | `./exporter/docusaurusExporter.js` |
| `src/index.ts` | IMPORTS | `./exporter/docxExporter.js` |
| `src/index.ts` | DEFINES | `src/index.ts#func#main` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/mcp/index.ts` |
| `src/mcp/index.ts` | IMPORTS | `@modelcontextprotocol/sdk/server/index.js` |
| `src/mcp/index.ts` | IMPORTS | `@modelcontextprotocol/sdk/server/stdio.js` |
| `src/mcp/index.ts` | IMPORTS | `@modelcontextprotocol/sdk/types.js` |
| `src/mcp/index.ts` | IMPORTS | `node:path` |
| `src/mcp/index.ts` | IMPORTS | `node:fs/promises` |
| `src/mcp/index.ts` | IMPORTS | `../analyzer/index.js` |
| `src/mcp/index.ts` | IMPORTS | `../planner/index.js` |
| `src/mcp/index.ts` | IMPORTS | `../storage/index.js` |
| `src/mcp/index.ts` | IMPORTS | `../storage/index.js` |
| `src/mcp/index.ts` | IMPORTS | `../types/index.js` |
| `src/mcp/index.ts` | IMPORTS | `../exporter/docusaurusExporter.js` |
| `src/mcp/index.ts` | IMPORTS | `../exporter/docxExporter.js` |
| `src/mcp/index.ts` | DEFINES | `src/mcp/index.ts#func#runServer` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/planner/e2eFlowGenerator.ts` |
| `src/planner/e2eFlowGenerator.ts` | IMPORTS | `../types/index.js` |
| `src/planner/e2eFlowGenerator.ts` | DEFINES | `src/planner/e2eFlowGenerator.ts#interface#E2EFlowOutput` |
| `src/planner/e2eFlowGenerator.ts` | DEFINES | `src/planner/e2eFlowGenerator.ts#class#E2EFlowGenerator` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/planner/index.ts` |
| `src/planner/index.ts` | IMPORTS | `../types/index.js` |
| `src/planner/index.ts` | IMPORTS | `./e2eFlowGenerator.js` |
| `src/planner/index.ts` | DEFINES | `src/planner/index.ts#interface#Planner` |
| `src/planner/index.ts` | DEFINES | `src/planner/index.ts#class#ModulePlanner` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/storage/index.ts` |
| `src/storage/index.ts` | IMPORTS | `node:fs/promises` |
| `src/storage/index.ts` | IMPORTS | `node:path` |
| `src/storage/index.ts` | IMPORTS | `../types/index.js` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#interface#RenderAdapter` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#class#DefaultMarkdownRenderAdapter` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#interface#NexusWriter` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#class#FileSystemNexusWriter` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#interface#StorageManager` |
| `src/storage/index.ts` | DEFINES | `src/storage/index.ts#class#NexusStorage` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/types/index.ts` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#GraphNode` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#GraphEdge` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#KnowledgeGraph` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#ModuleTask` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#GraphProvider` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#ExecutionPlan` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#UserReviewHandler` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#ModuleDocOutput` |
| `src/types/index.ts` | DEFINES | `src/types/index.ts#interface#NexusMetadata` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `src/workflow/index.ts` |
| `src/workflow/index.ts` | IMPORTS | `node:path` |
| `src/workflow/index.ts` | IMPORTS | `../types/index.js` |
| `src/workflow/index.ts` | IMPORTS | `../executor/index.js` |
| `src/workflow/index.ts` | IMPORTS | `../planner/index.js` |
| `src/workflow/index.ts` | IMPORTS | `../storage/index.js` |
| `src/workflow/index.ts` | DEFINES | `src/workflow/index.ts#class#PlaceholderUserReview` |
| `src/workflow/index.ts` | DEFINES | `src/workflow/index.ts#interface#WorkflowOptions` |
| `src/workflow/index.ts` | DEFINES | `src/workflow/index.ts#class#NexusWorkflowOrchestrator` |
| `/Users/arsya/Desktop/projects/okf` | CONTAINS_FILE | `tsconfig.json` |

---

# 5. Catatan Pengecekan

Dokumen E2E ini diekstraksi secara otomatis dari AST kode sumber.
Semua relasi komponen menggambarkan dependensi faktual sistem.