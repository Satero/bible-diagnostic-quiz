// Bible Diagnostic Quiz — question bank
// 102 free-response questions across 8 categories: book/chapter references,
// fill-in-the-blank recall, and famous-verse citations. Self-graded — the app
// reveals the accepted answer (and any accepted alternate phrasings) and the
// user marks their own typed answer correct or incorrect.
// Verse quotations are from the ESV® Bible (see index.html footer for required attribution).
//
// Shape: { id, category, prompt, answer, accepted?: [alternate acceptable phrasings] }

const QUESTIONS = [

  // ---------------- Pentateuch (Genesis–Deuteronomy) ----------------
  { id: 1, category: "Pentateuch", prompt: "According to Genesis 1, land animals and humans were created on which day of creation?", answer: "Day 6", accepted: ["The sixth day", "6"] },
  { id: 2, category: "Pentateuch", prompt: "What sign did God give Noah as a covenant promise never to flood the whole earth again?", answer: "The rainbow" },
  { id: 3, category: "Pentateuch", prompt: "God changed Abram's name to Abraham as part of a covenant promising he would become the father of what?", answer: "A multitude of nations", accepted: ["Many nations"] },
  { id: 4, category: "Pentateuch", prompt: "Which of Jacob's sons was sold into slavery by his brothers and later rose to power in Egypt?", answer: "Joseph" },
  { id: 5, category: "Pentateuch", prompt: "Through whom did God deliver Israel from slavery in Egypt, confronting Pharaoh with the plagues?", answer: "Moses", accepted: ["Moses and Aaron"] },
  { id: 6, category: "Pentateuch", prompt: "The Ten Commandments are found in what book and chapter of the Bible?", answer: "Exodus 20", accepted: ["Exodus chapter 20"] },
  { id: 7, category: "Pentateuch", prompt: "Which book of the Pentateuch is devoted mainly to laws on holiness, sacrifice, and worship for Israel?", answer: "Leviticus" },
  { id: 8, category: "Pentateuch", prompt: "Israel wandered in the wilderness for 40 years largely because of their unbelief after the report of the twelve ___.", answer: "Spies" },
  { id: 9, category: "Pentateuch", prompt: "Deuteronomy is largely structured as Moses' ___ speeches, restating the law to a new generation before they enter Canaan.", answer: "Farewell", accepted: ["Final"] },
  { id: 10, category: "Pentateuch", prompt: "'You shall love your neighbor as yourself' is not one of the Ten Commandments — it's actually found earlier in what book?", answer: "Leviticus", accepted: ["Leviticus 19"] },
  { id: 11, category: "Pentateuch", prompt: "'In the beginning, God created the heavens and the earth' is the opening verse of which book?", answer: "Genesis", accepted: ["Genesis 1", "Genesis 1:1"] },
  { id: 12, category: "Pentateuch", prompt: "The Passover meal instituted in Exodus 12 commemorates what event?", answer: "The final plague (death of the firstborn) and Israel's deliverance from Egypt", accepted: ["The tenth plague", "Death of the firstborn", "Israel's deliverance from Egypt"] },

  // ---------------- Historical Books (Joshua–Esther) ----------------
  { id: 13, category: "Historical Books", prompt: "In Joshua 6, the Israelites conquer what fortified city after marching around it for seven days and blowing trumpets?", answer: "Jericho" },
  { id: 14, category: "Historical Books", prompt: "The book of Judges describes a repeating cycle of Israel's sin, oppression, crying out to God, and ___ by a judge.", answer: "Deliverance", accepted: ["Rescue"] },
  { id: 15, category: "Historical Books", prompt: "Ruth, a Moabite widow, became an ancestor of which future king of Israel?", answer: "David" },
  { id: 16, category: "Historical Books", prompt: "Who was Israel's first king, anointed by the prophet Samuel?", answer: "Saul" },
  { id: 17, category: "Historical Books", prompt: "David became famous for defeating which Philistine giant in single combat?", answer: "Goliath" },
  { id: 18, category: "Historical Books", prompt: "Which king, known for God-given wisdom, built the first temple in Jerusalem?", answer: "Solomon" },
  { id: 19, category: "Historical Books", prompt: "After Solomon's reign, the kingdom of Israel split into two kingdoms — name both.", answer: "Israel (north) and Judah (south)", accepted: ["Israel and Judah", "Northern kingdom and southern kingdom"] },
  { id: 20, category: "Historical Books", prompt: "Elijah and Elisha are prophets found in what book(s) of the Bible?", answer: "1–2 Kings", accepted: ["1 Kings and 2 Kings", "1 and 2 Kings", "First and Second Kings", "Kings"] },
  { id: 21, category: "Historical Books", prompt: "Elijah and Elisha were prophets who spoke out against ___.", answer: "Idolatry", accepted: ["Baal worship", "Idol worship"] },
  { id: 22, category: "Historical Books", prompt: "1–2 Chronicles retell Israel's history with special focus on the Davidic line and ___ worship.", answer: "Temple" },
  { id: 23, category: "Historical Books", prompt: "The book of Esther is unique among Old Testament books because it never directly mentions what?", answer: "God", accepted: ["God's name"] },
  { id: 24, category: "Historical Books", prompt: "What role did Esther hold in the Persian court that allowed her to save the Jewish people from Haman's plot?", answer: "Queen (of Persia)", accepted: ["She became queen"] },

  // ---------------- Wisdom & Poetry (Job–Song of Solomon) ----------------
  { id: 25, category: "Wisdom & Poetry", prompt: "The book of Job wrestles primarily with the question of why the ___ suffer.", answer: "Righteous", accepted: ["Innocent"] },
  { id: 26, category: "Wisdom & Poetry", prompt: "At the end of Job, God responds to Job's suffering mainly by pointing to his own power and wisdom displayed in what?", answer: "Creation", accepted: ["Nature", "The created world"] },
  { id: 27, category: "Wisdom & Poetry", prompt: "What book of the Bible is a collection of songs and prayers of praise, lament, and trust in God?", answer: "Psalms" },
  { id: 28, category: "Wisdom & Poetry", prompt: "'The LORD is my shepherd; I shall not want' is the opening line of which Psalm?", answer: "Psalm 23" },
  { id: 29, category: "Wisdom & Poetry", prompt: "Proverbs, a book of practical wisdom for godly living, is largely attributed to which king?", answer: "Solomon" },
  { id: 30, category: "Wisdom & Poetry", prompt: "'Trust in the LORD with all your heart, and do not lean on your own understanding... he will make straight your paths' — what book and chapter is this from?", answer: "Proverbs 3" },
  { id: 31, category: "Wisdom & Poetry", prompt: "Which book repeats the refrain 'Vanity of vanities... all is vanity,' teaching that life is fleeting without God?", answer: "Ecclesiastes" },
  { id: 32, category: "Wisdom & Poetry", prompt: "Song of Solomon (Song of Songs) is a poetic book centered on what theme?", answer: "Romantic/marital love", accepted: ["Love"] },
  { id: 33, category: "Wisdom & Poetry", prompt: "'Have mercy on me, O God, according to your steadfast love' opens which Psalm, traditionally linked to David's repentance after his sin with Bathsheba?", answer: "Psalm 51" },
  { id: 34, category: "Wisdom & Poetry", prompt: "Psalm 119, the longest chapter in the Bible, is structured around praise for what?", answer: "God's law/word", accepted: ["The law", "Scripture"] },
  { id: 35, category: "Wisdom & Poetry", prompt: "'For everything there is a season, and a time for every matter under heaven' is found in which book?", answer: "Ecclesiastes" },
  { id: 36, category: "Wisdom & Poetry", prompt: "Job's friends argue that his suffering must be the result of ___ on his part.", answer: "Hidden sin", accepted: ["Sin"] },

  // ---------------- Prophets (Isaiah–Malachi) ----------------
  { id: 37, category: "Prophets", prompt: "Isaiah 9:6 gives a coming Messiah several titles, including 'Wonderful Counselor' and ___.", answer: "Mighty God", accepted: ["Everlasting Father", "Prince of Peace"] },
  { id: 38, category: "Prophets", prompt: "Jeremiah is called the 'weeping prophet' because he was persecuted and grieved over the coming judgment of ___.", answer: "Judah", accepted: ["Jerusalem"] },
  { id: 39, category: "Prophets", prompt: "'For I know the plans I have for you... plans to give you a future and a hope' — what book and chapter is this from?", answer: "Jeremiah 29" },
  { id: 40, category: "Prophets", prompt: "Lamentations mourns the destruction of what city?", answer: "Jerusalem" },
  { id: 41, category: "Prophets", prompt: "Ezekiel's visions, including the valley of dry bones, were addressed to Israelites experiencing what?", answer: "Exile in Babylon", accepted: ["The Babylonian exile", "Exile"] },
  { id: 42, category: "Prophets", prompt: "Daniel is best known for surviving a night in a den of ___.", answer: "Lions" },
  { id: 43, category: "Prophets", prompt: "The book of Hosea uses the prophet's own troubled marriage as a picture of what?", answer: "Israel's unfaithfulness to God", accepted: ["Israel's idolatry", "Spiritual unfaithfulness"] },
  { id: 44, category: "Prophets", prompt: "Joel's prophecy about a locust plague ultimately points forward to a future outpouring of what?", answer: "God's Spirit", accepted: ["The Holy Spirit"] },
  { id: 45, category: "Prophets", prompt: "Amos, prophesying to the northern kingdom, placed strong emphasis on what theme?", answer: "Social justice/righteousness", accepted: ["Justice"] },
  { id: 46, category: "Prophets", prompt: "Jonah tried to flee from God's call to preach to which city?", answer: "Nineveh" },
  { id: 47, category: "Prophets", prompt: "Micah 6:8 — 'He has told you, O man, what is good... to do justice, to love kindness, and to ___.'", answer: "Walk humbly with your God", accepted: ["Walk humbly"] },
  { id: 48, category: "Prophets", prompt: "Habakkuk 2:4 states that 'the righteous shall live by his ___' — a line later quoted three times in the New Testament (Romans, Galatians, Hebrews).", answer: "Faith" },
  { id: 49, category: "Prophets", prompt: "Malachi 3:8 accuses the people of robbing God by failing to bring their full ___ and offerings.", answer: "Tithes", accepted: ["Tithe"] },

  // ---------------- Gospels (Matthew–John) ----------------
  { id: 50, category: "Gospels", prompt: "Which Gospel was written especially to show Jesus as the fulfillment of Jewish prophecy and the promised Messiah/King?", answer: "Matthew" },
  { id: 51, category: "Gospels", prompt: "The Sermon on the Mount, including the Beatitudes, is recorded in which Gospel?", answer: "Matthew" },
  { id: 52, category: "Gospels", prompt: "Which Gospel is known for its fast pace and its portrayal of Jesus as a suffering servant who acts decisively?", answer: "Mark" },
  { id: 53, category: "Gospels", prompt: "Which Gospel places special emphasis on Jesus' compassion toward the poor, outcasts, women, and sinners?", answer: "Luke" },
  { id: 54, category: "Gospels", prompt: "The parable of the Prodigal Son is found in which Gospel?", answer: "Luke" },
  { id: 55, category: "Gospels", prompt: "Which Gospel focuses heavily on Jesus' divine identity through 'I am' statements and signs, differing from the other three?", answer: "John" },
  { id: 56, category: "Gospels", prompt: "'For God so loved the world, that he gave his only Son...' is found in what book and chapter?", answer: "John 3" },
  { id: 57, category: "Gospels", prompt: "At Jesus' baptism, what descended on him as the Father's voice spoke from heaven?", answer: "The Holy Spirit, like a dove", accepted: ["A dove", "The Spirit"] },
  { id: 58, category: "Gospels", prompt: "Jesus' first recorded miracle — turning water into wine at Cana — is found in what book and chapter?", answer: "John 2" },
  { id: 59, category: "Gospels", prompt: "The Last Supper took place during which Jewish feast?", answer: "Passover" },
  { id: 60, category: "Gospels", prompt: "Who betrayed Jesus to the religious authorities, and for how many pieces of silver?", answer: "Judas Iscariot, thirty pieces of silver", accepted: ["Judas", "30 pieces of silver"] },
  { id: 61, category: "Gospels", prompt: "According to all four Gospels, Jesus rose from the dead on which day after the crucifixion?", answer: "The third day" },
  { id: 62, category: "Gospels", prompt: "The Great Commission ('go and make disciples of all nations') closes out which Gospel?", answer: "Matthew" },

  // ---------------- Acts & Early Church ----------------
  { id: 63, category: "Acts & Early Church", prompt: "The book of Acts, written by the author of Luke's Gospel, narrates the spread of the early church through the power of what?", answer: "The Holy Spirit" },
  { id: 64, category: "Acts & Early Church", prompt: "On the day of Pentecost, what dramatic sign accompanied the Holy Spirit coming upon the apostles?", answer: "Tongues of fire (and the sound of a rushing wind)", accepted: ["Tongues of fire", "Wind and fire"] },
  { id: 65, category: "Acts & Early Church", prompt: "Stephen, the first Christian martyr, is stoned to death in what book and chapter?", answer: "Acts 7" },
  { id: 66, category: "Acts & Early Church", prompt: "Saul of Tarsus was dramatically converted on the road to what city?", answer: "Damascus" },
  { id: 67, category: "Acts & Early Church", prompt: "After his conversion, Saul became known by what missionary name?", answer: "Paul" },
  { id: 68, category: "Acts & Early Church", prompt: "The Jerusalem Council in Acts 15 addressed whether Gentile believers needed to follow Jewish law, especially what practice?", answer: "Circumcision" },
  { id: 69, category: "Acts & Early Church", prompt: "Peter's vision of a sheet with unclean animals in Acts 10 led directly to the gospel opening to Gentiles, starting with which Roman centurion?", answer: "Cornelius" },
  { id: 70, category: "Acts & Early Church", prompt: "Paul's missionary journeys primarily established churches throughout what region(s)?", answer: "Asia Minor, Greece, and (eventually) Rome", accepted: ["Asia Minor and Greece", "The Roman Empire"] },
  { id: 71, category: "Acts & Early Church", prompt: "The book of Acts ends with Paul under house arrest in what city, still preaching?", answer: "Rome" },
  { id: 72, category: "Acts & Early Church", prompt: "Who vouched for Paul to the suspicious Jerusalem church and partnered with him in early missionary work?", answer: "Barnabas" },
  { id: 73, category: "Acts & Early Church", prompt: "The early Jerusalem believers were noted for sharing possessions, fellowship, prayer, and what apostolic activity?", answer: "The apostles' teaching", accepted: ["Teaching"] },
  { id: 74, category: "Acts & Early Church", prompt: "According to Acts 11, believers were first called 'Christians' in which city?", answer: "Antioch" },

  // ---------------- Epistles (Romans–Jude) ----------------
  { id: 75, category: "Epistles", prompt: "Which of Paul's letters is often seen as his most systematic explanation of the gospel — sin, justification by faith, and salvation?", answer: "Romans" },
  { id: 76, category: "Epistles", prompt: "'For all have sinned and fall short of the glory of God' is found in what book and chapter?", answer: "Romans 3" },
  { id: 77, category: "Epistles", prompt: "The 'love chapter,' often read at weddings, is found in which letter and chapter?", answer: "1 Corinthians 13", accepted: ["First Corinthians 13"] },
  { id: 78, category: "Epistles", prompt: "Galatians is Paul's strongest defense that believers are justified by faith rather than by what?", answer: "Works of the law", accepted: ["The law", "Works"] },
  { id: 79, category: "Epistles", prompt: "Ephesians describes the church using what image, united under one head?", answer: "The body of Christ", accepted: ["A body"] },
  { id: 80, category: "Epistles", prompt: "'I can do all things through him who strengthens me' is found in what book and chapter?", answer: "Philippians 4" },
  { id: 81, category: "Epistles", prompt: "Colossians describes Christ as 'the image of the invisible God,' in whom all things ___.", answer: "Hold together", accepted: ["Consist"] },
  { id: 82, category: "Epistles", prompt: "1 & 2 Thessalonians deal significantly with the return of Christ and hope for believers who have done what?", answer: "Died", accepted: ["Fallen asleep", "Passed away"] },
  { id: 83, category: "Epistles", prompt: "1 Timothy gives Timothy instructions for organizing the church in Ephesus, including qualifications for elders/overseers and what other church office?", answer: "Deacons" },
  { id: 84, category: "Epistles", prompt: "Hebrews argues Jesus is superior to the old covenant by presenting him as the great ___ whose sacrifice fulfills the old system.", answer: "High priest", accepted: ["Priest"] },
  { id: 85, category: "Epistles", prompt: "James emphasizes that genuine faith is shown by what, not just belief?", answer: "Works", accepted: ["Actions", "Deeds"] },
  { id: 86, category: "Epistles", prompt: "1 Peter was written to encourage believers who were facing what?", answer: "Suffering and persecution", accepted: ["Persecution"] },
  { id: 87, category: "Epistles", prompt: "1 John repeatedly emphasizes that God is light, and that God is ___.", answer: "Love" },
  { id: 101, category: "Epistles", prompt: "2 Timothy, Paul's final letter written from prison shortly before his death, is famous for declaring that all ___ is breathed out by God and profitable for teaching.", answer: "Scripture" },
  { id: 102, category: "Epistles", prompt: "Titus was left in Crete to appoint elders and combat false teachers; the letter especially emphasizes that good works should flow from what?", answer: "God's grace", accepted: ["Grace"] },

  // ---------------- Revelation & Famous Verses ----------------
  { id: 88, category: "Revelation & Famous Verses", prompt: "John wrote Revelation while exiled on what island?", answer: "Patmos" },
  { id: 89, category: "Revelation & Famous Verses", prompt: "Revelation opens with letters addressed to how many churches, located in what region?", answer: "Seven churches in Asia Minor", accepted: ["7 churches"] },
  { id: 90, category: "Revelation & Famous Verses", prompt: "Revelation's central hope in its closing chapters is a new heaven and new earth where God does what?", answer: "Dwells with his people", accepted: ["Lives with his people"] },
  { id: 91, category: "Revelation & Famous Verses", prompt: "'Be strong and courageous... for the LORD your God is with you wherever you go' is found in what book and chapter?", answer: "Joshua 1" },
  { id: 92, category: "Revelation & Famous Verses", prompt: "'The wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord' is found in what book and chapter?", answer: "Romans 6" },
  { id: 93, category: "Revelation & Famous Verses", prompt: "'And we know that for those who love God all things work together for good' is found in what book and chapter?", answer: "Romans 8" },
  { id: 94, category: "Revelation & Famous Verses", prompt: "Jesus' summary of the Law — love God, and love your neighbor as yourself — is recorded in what book and chapter?", answer: "Matthew 22" },
  { id: 95, category: "Revelation & Famous Verses", prompt: "'This is the day that the LORD has made; let us rejoice and be glad in it' is found in what book and chapter?", answer: "Psalm 118" },
  { id: 96, category: "Revelation & Famous Verses", prompt: "'Put on the whole armor of God, that you may be able to stand against the schemes of the devil' is found in what book and chapter?", answer: "Ephesians 6" },
  { id: 97, category: "Revelation & Famous Verses", prompt: "'Come to me, all who labor and are heavy laden, and I will give you rest' is found in what book and chapter?", answer: "Matthew 11" },
  { id: 98, category: "Revelation & Famous Verses", prompt: "The shortest verse in the Bible (just two words in English) — what does it say, and what book and chapter is it in?", answer: "'Jesus wept' — John 11", accepted: ["Jesus wept, John 11"] },
  { id: 99, category: "Revelation & Famous Verses", prompt: "'They who wait for the LORD shall renew their strength; they shall mount up with wings like eagles' is found in what book and chapter?", answer: "Isaiah 40" },
  { id: 100, category: "Revelation & Famous Verses", prompt: "'Your word is a lamp to my feet and a light to my path' is found in what book and chapter?", answer: "Psalm 119" },

];
