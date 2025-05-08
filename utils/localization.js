// Localization utility for multilingual support

// Define translations for different languages
const translations = {
  en: {
    // General UI
    appTitle: "Index for Me",
    importIndex: "Import Index",
    visualWorkspace: "Visual Workspace",
    items: "items",
    textInput: "Text Input",
    fileUpload: "File Upload",
    clearWorkspace: "Clear Workspace",
    copy: "Copy",
    word: "Word",
    pdf: "PDF",
    settings: "Settings",
    collaborate: "Collaborate",
    guide: "Guide",

    // Actions
    pasteText: "Paste your index text",
    clear: "Clear",
    extract: "Extract Index",
    processing: "Processing...",
    dragDrop: "Drag & drop your file here or click to browse",
    supportedFormats: "Supported formats: PDF, Word (.doc, .docx)",
    exportWord: "Export as Word document",
    exportPDF: "Export as PDF document",
    copyClipboard: "Copy formatted index to clipboard",

    // Editing
    addItem: "Add Item",
    editItem: "Edit Item",
    deleteItem: "Delete Item",
    increaseLevel: "Increase level",
    decreaseLevel: "Decrease level",
    undo: "Undo",
    redo: "Redo",

    // Guide
    guideTitle: "Index Guide",
    guideIntro:
      "An index is a list of terms, typically arranged in alphabetical order, that points readers to the location of information in a book or document.",
    indexTypes: "Types of Indexes",

    // Collaboration
    collaborationTitle: "Collaboration",
    share: "Share Link",
    inviteMembers: "Invite Members",
    comments: "Comments",

    // Settings
    uiSettings: "UI Settings",
    theme: "Theme",
    fontSize: "Font Size",
    language: "Language",

    // Messages
    indexExtracted: "Index extracted successfully",
    noIndex: "No index to export",
    copied: "Index copied to clipboard",
    exported: "Document exported successfully",
    cleared: "Workspace cleared",
    confirmClear: "Are you sure you want to clear the workspace? This action cannot be undone.",

    // Suggestions
    suggestions: "Suggestions",
    applySuggestion: "Apply",
    ignoreSuggestion: "Ignore",
    suggestionsTitle: "Index Improvement Suggestions",
    alphabeticalSuggestion: "Consider sorting top-level entries alphabetically",
    hierarchySuggestion: "Consider grouping related sub-entries",

    // New features
    addNewItem: "Add New Item",
    editMode: "Edit Mode",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    projectName: "Project Name",
    autoSaved: "Auto-saved",
    saveNow: "Save Now",

    // Create Index Form
    createNew: "Create New",
    createIndex: "Create a New Index",
    numberOfSections: "Number of Sections",
    numberOfSubSections: "Number of Sub-sections",
    numberOfBranches: "Number of Branches",
    numberOfElements: "Number of Elements",
    mainCategories: "Main categories (level 0)",
    subCategoriesPerSection: "Sub-categories per section (level 1)",
    branchesPerSubSection: "Branches per sub-section (level 2)",
    elementsPerBranch: "Elements per branch (level 3)",
    createIndexButton: "Generate Index",
    generating: "Generating...",
    preview: "Structure Preview",
    previewNote: "This is a simplified preview. The actual index will include full item details.",
    invalidSectionsNumber: "Please enter a valid number of sections (1-20)",
    invalidSubSectionsNumber: "Please enter a valid number of sub-sections (0-10)",
    invalidBranchesNumber: "Please enter a valid number of branches (0-10)",
    invalidElementsNumber: "Please enter a valid number of elements (0-10)",
    indexCreated: "Index created successfully",
  },
  ar: {
    // General UI
    appTitle: "فهرسي",
    importIndex: "استيراد الفهرس",
    visualWorkspace: "مساحة العمل المرئية",
    items: "عناصر",
    textInput: "إدخال النص",
    fileUpload: "تحميل الملف",
    clearWorkspace: "مسح مساحة العمل",
    copy: "نسخ",
    word: "وورد",
    pdf: "بي دي إف",
    settings: "الإعدادات",
    collaborate: "تعاون",
    guide: "دليل",

    // Actions
    pasteText: "الصق نص الفهرس الخاص بك",
    clear: "مسح",
    extract: "استخراج الفهرس",
    processing: "جاري المعالجة...",
    dragDrop: "اسحب وأفلت ملفك هنا أو انقر للتصفح",
    supportedFormats: "الصيغ المدعومة: PDF، Word (.doc، .docx)",
    exportWord: "تصدير كمستند وورد",
    exportPDF: "تصدير كمستند PDF",
    copyClipboard: "نسخ الفهرس المنسق إلى الحافظة",

    // Editing
    addItem: "إضافة عنصر",
    editItem: "تعديل العنصر",
    deleteItem: "حذف العنصر",
    increaseLevel: "زيادة المستوى",
    decreaseLevel: "تقليل المستوى",
    undo: "تراجع",
    redo: "إعادة",

    // Guide
    guideTitle: "دليل الفهرسة",
    guideIntro: "الفهرس هو قائمة بالمصطلحات، مرتبة عادة أبجديًا، تشير إلى موقع المعلومات في كتاب أو مستند.",
    indexTypes: "أنواع الفهارس",

    // Collaboration
    collaborationTitle: "التعاون",
    share: "مشاركة الرابط",
    inviteMembers: "دعوة أعضاء",
    comments: "تعليقات",

    // Settings
    uiSettings: "إعدادات الواجهة",
    theme: "السمة",
    fontSize: "حجم الخط",
    language: "اللغة",

    // Messages
    indexExtracted: "تم استخراج الفهرس بنجاح",
    noIndex: "لا يوجد فهرس للتصدير",
    copied: "تم نسخ الفهرس إلى الحافظة",
    exported: "تم تصدير المستند بنجاح",
    cleared: "تم مسح مساحة العمل",
    confirmClear: "هل أنت متأكد أنك تريد مسح مساحة العمل؟ لا يمكن التراجع عن هذا الإجراء.",

    // Suggestions
    suggestions: "اقتراحات",
    applySuggestion: "تطبيق",
    ignoreSuggestion: "تجاهل",
    suggestionsTitle: "اقتراحات تحسين الفهرس",
    alphabeticalSuggestion: "يُنصح بترتيب المدخلات الرئيسية أبجديًا",
    hierarchySuggestion: "يُنصح بتجميع المدخلات الفرعية المتعلقة ببعضها",

    // New features
    addNewItem: "إضافة عنصر جديد",
    editMode: "وضع التعديل",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    projectName: "اسم المشروع",
    autoSaved: "حفظ تلقائي",
    saveNow: "حفظ الآن",

    // Create Index Form
    createNew: "إنشاء جديد",
    createIndex: "إنشاء فهرس جديد",
    numberOfSections: "عدد الأقسام",
    numberOfSubSections: "عدد الأقسام الفرعية",
    numberOfBranches: "عدد الفروع",
    numberOfElements: "عدد العناصر",
    mainCategories: "الفئات الرئيسية (المستوى 0)",
    subCategoriesPerSection: "الفئات الفرعية لكل قسم (المستوى 1)",
    branchesPerSubSection: "الفروع لكل قسم فرعي (المستوى 2)",
    elementsPerBranch: "العناصر لكل فرع (المستوى 3)",
    createIndexButton: "إنشاء الفهرس",
    generating: "جاري الإنشاء...",
    preview: "معاينة الهيكل",
    previewNote: "هذه معاينة مبسطة. سيتضمن الفهرس الفعلي تفاصيل كاملة للعناصر.",
    invalidSectionsNumber: "الرجاء إدخال عدد صحيح للأقسام (1-20)",
    invalidSubSectionsNumber: "الرجاء إدخال عدد صحيح للأقسام الفرعية (0-10)",
    invalidBranchesNumber: "الرجاء إدخال عدد صحيح للفروع (0-10)",
    invalidElementsNumber: "الرجاء إدخال عدد صحيح للعناصر (0-10)",
    indexCreated: "تم إنشاء الفهرس بنجاح",
  },
}

// Function to get a translated value
function getTranslation(key, lang) {
  if (!translations[lang] || !translations[lang][key]) {
    return translations.en[key] || key
  }
  return translations[lang][key]
}

// Create a translation function for a specific language
function createTranslator(language) {
  return (key) => getTranslation(key, language)
}
