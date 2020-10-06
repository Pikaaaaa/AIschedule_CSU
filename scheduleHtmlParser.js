function getWeek(week){
    let weekType;let numEnd;
    if (week.indexOf("单周") > 0){
        weekType = 1
        numEnd = week.indexOf("单周") - 1
    }else if(week.indexOf("双周") > 0){
        weekType = 0
        numEnd = week.indexOf("双周") - 1
    }else{
        weekType = 2
        numEnd = week.indexOf("周") - 1
    }
    week = week.slice(0,numEnd)

    let weekList = week.split(",")
    let weekListOneByOne = []
    for (let i = 0; i < weekList.length; i++){
        if (weekList[i].indexOf("-") > 0) {
            let addNum = 1
            startWeek = Number(weekList[i].split("-")[0])
            endWeek = Number(weekList[i].split("-")[1])
            if (weekType == 0 || weekType == 1) {
                addNum = 2
                if (startWeek % 2 != weekType) startWeek++
            }
            for (let j = startWeek; j <= endWeek; j = j + addNum){
                weekListOneByOne.push(j)
            }
        }else{
            weekListOneByOne.push(parseInt(weekList[i]))
        }
    }
    return weekListOneByOne
}

function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    //以下为示例，您可以完全重写或在此基础上更改
    let result = []
    let courseData = $("div.kbcontent")
    for (let count = 0; count < courseData.length; count++) {
        let classData = $(courseData[count]).find("font")
        if (classData.length) {
            let className = $(courseData[count]).text()
            let classDataPart = {}
            //console.log(classData.length)
            for (let i = 0; i < classData.length; i++) {
                //获取教师，周次，教室
                //数据初始化,防止带入上一课程的数据
                var teacherName = ""
                var classroom = ""
                keyWord = $(classData[i]).attr("title")
                //console.log(keyWord)
                if (keyWord == "老师") {
                    teacherName = $(classData[i]).text()
                    classDataPart["teacher"] = teacherName
                    className = className.replace(teacherName,"")
                    //console.log(teacherName)
                } else if (keyWord == "周次(节次)") {
                    var weekDataOrigin = $(classData[i]).text()
                    var weekData = getWeek(weekDataOrigin)
                    classDataPart["weeks"] = weekData
                    //console.log(weekData)
                } else if (keyWord == "教室") {
                    classroom = $(classData[i]).text()
                    classDataPart["position"] = classroom
                }
            }
            className = className.replace(weekDataOrigin,"").replace(classroom,"")
            classDataPart["name"] = className
            //console.log(className)
            //console.log(classData.length)
            //得到星期
            if (count){
                var whichday = (count - 1) % 7 + 1
            }else{
                var whichday = 7
            }
            classDataPart["day"] = whichday
            //得到第几节课
            let whichSection = parseInt(count / 7) + 1
            classDataPart["sections"] = [{section : whichSection}]
            //console.log(whichday)
            result.push(classDataPart)
        }
        //console.log(count)
        //console.log(courseData)
     }

     let sectionTimesInfos = [
      {
        "section": 1,
        "startTime": "08:00",
        "endTime": "09:40"
      },
      {
        "section": 2,
        "startTime": "10:00",
        "endTime": "11:40"
      },
      {
        "section": 3,
        "startTime": "14:00",
        "endTime": "15:40"
      },
      {
        "section": 4,
        "startTime": "16:00",
        "endTime": "17:40"
      },
      {
        "section": 5,
        "startTime": "19:00",
        "endTime": "20:40"
      }
    ]
     console.log(result)

    return { courseInfos: result, sectionTimes : sectionTimesInfos}
}