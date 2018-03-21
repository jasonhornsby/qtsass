# qtsass (WIP)
Simple wrapper around node-sass to be able to compile QT css files. Pre and post processes files so valid qss is returned by the sas compiler

### Known problems with qss files
* Hex #aarrggbb rgba() color values dont get recognized as colors by sass compiler (done)
* QSS style rgba() with % alpha value converted to CSS type (WIP)
* ! not operator in qss does not exist in css (done)
* qlineargradient() doesnt fit css syntax (WIP)
