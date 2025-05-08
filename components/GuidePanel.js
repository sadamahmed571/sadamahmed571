"use client"

// Educational Guide Panel Component
function GuidePanel({ isOpen, onClose, language }) {
  const t = createTranslator(language)

  return (
    <div className={`guide-panel ${isOpen ? "open" : ""}`} data-id="j9q9i44tk" data-path="components/GuidePanel.js">
      <div className="guide-header" data-id="8zadtkgpg" data-path="components/GuidePanel.js">
        <h2 data-id="vc0nqk0qg" data-path="components/GuidePanel.js">
          {t("guideTitle")}
        </h2>
        <button className="close-btn" onClick={onClose} data-id="xt5ydmygz" data-path="components/GuidePanel.js">
          <i className="fas fa-times" data-id="b62q02acd" data-path="components/GuidePanel.js"></i>
        </button>
      </div>

      <div className="guide-content" data-id="ekq7dn4kc" data-path="components/GuidePanel.js">
        <section data-id="lra8adf2f" data-path="components/GuidePanel.js">
          <h3 data-id="kafwlchhp" data-path="components/GuidePanel.js">
            {t("indexTypes")}
          </h3>
          <div className="guide-card" data-id="rr3rdqk1n" data-path="components/GuidePanel.js">
            <h4 data-id="6pt2ybilj" data-path="components/GuidePanel.js">
              Subject Index
            </h4>
            <p data-id="40zd47uu6" data-path="components/GuidePanel.js">
              The most common type of index, listing topics or concepts in alphabetical order with page references.
            </p>
            <div className="example" data-id="x7qi0kmbj" data-path="components/GuidePanel.js">
              <strong data-id="9u30wznuv" data-path="components/GuidePanel.js">
                Example:
              </strong>
              <ul data-id="oqb977aaq" data-path="components/GuidePanel.js">
                <li data-id="ytows35gm" data-path="components/GuidePanel.js">
                  Algorithms, 45–52
                </li>
                <li data-id="ikraijata" data-path="components/GuidePanel.js">
                  Data structures
                  <ul data-id="5xm5bfc88" data-path="components/GuidePanel.js">
                    <li data-id="q8igu5lil" data-path="components/GuidePanel.js">
                      arrays, 23–30
                    </li>
                    <li data-id="n86hb5nen" data-path="components/GuidePanel.js">
                      linked lists, 31–39
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="guide-card" data-id="ihuht5aug" data-path="components/GuidePanel.js">
            <h4 data-id="awwklqka1" data-path="components/GuidePanel.js">
              Author Index
            </h4>
            <p data-id="fho53664x" data-path="components/GuidePanel.js">
              Lists authors cited in a work, alphabetically by surname with page references.
            </p>
            <div className="example" data-id="x1zel7xvw" data-path="components/GuidePanel.js">
              <strong data-id="wuynusc24" data-path="components/GuidePanel.js">
                Example:
              </strong>
              <ul data-id="lyrp7pfcq" data-path="components/GuidePanel.js">
                <li data-id="42a7pjhxx" data-path="components/GuidePanel.js">
                  Johnson, A., 12, 34–35
                </li>
                <li data-id="h1oi12cap" data-path="components/GuidePanel.js">
                  Smith, J., 42, 78–80
                </li>
              </ul>
            </div>
          </div>

          <div className="guide-card" data-id="ynr6sltok" data-path="components/GuidePanel.js">
            <h4 data-id="knjq36cjj" data-path="components/GuidePanel.js">
              Hierarchical Index
            </h4>
            <p data-id="yg5phk5a6" data-path="components/GuidePanel.js">
              Organizes entries in a hierarchy with main entries and several levels of subentries.
            </p>
          </div>
        </section>

        <section data-id="8wovmsl52" data-path="components/GuidePanel.js">
          <h3 data-id="zmr7vtda9" data-path="components/GuidePanel.js">
            Best Practices
          </h3>
          <div className="guide-list" data-id="9s58ui8zz" data-path="components/GuidePanel.js">
            <div className="guide-list-item" data-id="nhp80cc51" data-path="components/GuidePanel.js">
              <i className="fas fa-check-circle" data-id="ri963xn5b" data-path="components/GuidePanel.js"></i>
              <div data-id="l8gg7vhv0" data-path="components/GuidePanel.js">
                <strong data-id="c61i3l7vv" data-path="components/GuidePanel.js">
                  Be consistent
                </strong>
                <p data-id="d6vg23epk" data-path="components/GuidePanel.js">
                  Use consistent terminology, formatting, and hierarchy throughout your index.
                </p>
              </div>
            </div>

            <div className="guide-list-item" data-id="va0ri4tie" data-path="components/GuidePanel.js">
              <i className="fas fa-check-circle" data-id="egsa85j7o" data-path="components/GuidePanel.js"></i>
              <div data-id="w3lw22usf" data-path="components/GuidePanel.js">
                <strong data-id="nlrqd1urc" data-path="components/GuidePanel.js">
                  Use meaningful entries
                </strong>
                <p data-id="ogito6e9m" data-path="components/GuidePanel.js">
                  Create entries that accurately reflect the content and will make sense to readers.
                </p>
              </div>
            </div>

            <div className="guide-list-item" data-id="ytbl0idju" data-path="components/GuidePanel.js">
              <i className="fas fa-check-circle" data-id="5nfe1meqh" data-path="components/GuidePanel.js"></i>
              <div data-id="tpcvbipzo" data-path="components/GuidePanel.js">
                <strong data-id="0tvsa2rek" data-path="components/GuidePanel.js">
                  Include cross-references
                </strong>
                <p data-id="1u94eze44" data-path="components/GuidePanel.js">
                  Use "See" and "See also" references to guide readers to related content.
                </p>
              </div>
            </div>

            <div className="guide-list-item" data-id="cmeuagt0p" data-path="components/GuidePanel.js">
              <i className="fas fa-check-circle" data-id="r6pzqqeci" data-path="components/GuidePanel.js"></i>
              <div data-id="jvrs2wv78" data-path="components/GuidePanel.js">
                <strong data-id="9neem0goq" data-path="components/GuidePanel.js">
                  Avoid over-indexing
                </strong>
                <p data-id="aogi5vxgq" data-path="components/GuidePanel.js">
                  Don't include every mention of a topic; focus on significant discussions.
                </p>
              </div>
            </div>

            <div className="guide-list-item" data-id="k9l46s2lj" data-path="components/GuidePanel.js">
              <i className="fas fa-check-circle" data-id="nqhlpy41i" data-path="components/GuidePanel.js"></i>
              <div data-id="ny8y35k5s" data-path="components/GuidePanel.js">
                <strong data-id="x1yhksyeb" data-path="components/GuidePanel.js">
                  Consider your audience
                </strong>
                <p data-id="30geljr09" data-path="components/GuidePanel.js">
                  Index terms your readers are likely to look for, not just technical terminology.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section data-id="tvzo8n2cg" data-path="components/GuidePanel.js">
          <h3 data-id="f0ceyyugl" data-path="components/GuidePanel.js">
            Index Structure
          </h3>
          <div className="guide-card" data-id="w95fcwins" data-path="components/GuidePanel.js">
            <h4 data-id="2e06fuiom" data-path="components/GuidePanel.js">
              Levels of Indexing
            </h4>
            <p data-id="h6yj9gli6" data-path="components/GuidePanel.js">
              A well-structured index typically has:
            </p>
            <ul data-id="wtcaawvpi" data-path="components/GuidePanel.js">
              <li data-id="i7dmlle2x" data-path="components/GuidePanel.js">
                <strong data-id="bnlll4yod" data-path="components/GuidePanel.js">
                  Main entries
                </strong>{" "}
                - Primary topics (level 0)
              </li>
              <li data-id="1imwu05zk" data-path="components/GuidePanel.js">
                <strong data-id="qixwn6ufo" data-path="components/GuidePanel.js">
                  Subentries
                </strong>{" "}
                - Subtopics or aspects of the main entry (level 1)
              </li>
              <li data-id="9uqfwvpxp" data-path="components/GuidePanel.js">
                <strong data-id="whoms7yff" data-path="components/GuidePanel.js">
                  Sub-subentries
                </strong>{" "}
                - Further divisions of subtopics (level 2)
              </li>
              <li data-id="xs62ddcx0" data-path="components/GuidePanel.js">
                <strong data-id="h3w3cotdq" data-path="components/GuidePanel.js">
                  Additional levels
                </strong>{" "}
                - For complex works (level 3+)
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
