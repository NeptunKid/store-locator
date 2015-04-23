# Store-Locator
_@author: Ruoyi Chen_
_E-mail: kidlaven@gmail.com_

### A Store Locator Demo for AKQA. ###
Please check out the latest version here: https://github.com/NeptunKid/store-locator

**DEMO**: http://neptunkid.github.io/store-locator/
**Repo**: https://github.com/NeptunKid/store-locator
**History**: https://github.com/NeptunKid/store-locator/commits/gh-pages


# Features:
1. Responsive design
  * Auto-adjustment when viewing on pc/tablet/mobile browser.
  * Search button is shown on pc & larger screens but hidden on tablet and mobile device. 
2. Show map with markers and list of stores at the same time using toggable tabs.
3. Pure css styling: no images were used (except the logo and marker icon :p).
4. Dynamic loading of javascript lib of baidu map.
5. Ajax (simulated) in store/city/province data pulling.
6. Smart draw:
   * No drawing of cities haven’t been selected.
   * No re-drawing of cities that have already been drawn before.  

# Compatibility:
1. PC Browsers:  * Firefox (latest)
  * Google Chrome (latest)
  * Safari (latest)
  * Opera (latest)
  * Internet Explorer 8 and higher
2. Others:
  * Android Chrome, Firefox
  * iOS Safari, Chrome, Wechat embedded browser
  * Android Wechat embedded browser (Positioning bugs to be fixed.)

# Dev Tools:
1. Editor: VIM - Vi IMproved 7.3
2. Environment: iTerm 2.0.0 + Mac OS X Yosemite 10.10.2 
3. Debug tool: Chrome Developer Tools 
4. Remote debugging: Real Device.    … - -|

# Plugin and Frameworks:
1. Bootstrap 3 (customized )
   Bootstrap css & components & js plugin for grid system layout, dropdown menu. 
2. jQuery 1.11
3. Baidu Map Api 2.0 (大众版）   
4. Nothing more.


# TO-DO:

-[ ] Fix the bug of positioning on Android Wechat browser (which is evil): dropdown button & menu list & scroll bar not correctly positioned 
-[ ] Add shadowed triangles to the bottom of tabs 
-[ ] Shorten mobile page to fit phone screens (able to be viewed within a single viewport on iPhone6).  
-[ ] Further polish ui style.
-[ ] Dynamically load mobile version of Baidu Map api when detecting useragent to be mobile device.   

