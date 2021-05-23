function getWeek(week) {
    let weekType; let numEnd;
    if (week.indexOf("单周") > 0) {
        weekType = 1
        numEnd = week.indexOf("单周") - 1
    } else if (week.indexOf("双周") > 0) {
        weekType = 0
        numEnd = week.indexOf("双周") - 1
    } else {
        weekType = 2
        numEnd = week.indexOf("周") - 1
    }
    week = week.slice(0, numEnd)

    let weekList = week.split(",")
    let weekListOneByOne = []
    for (let i = 0; i < weekList.length; i++) {
        if (weekList[i].indexOf("-") > 0) {
            let addNum = 1
            startWeek = Number(weekList[i].split("-")[0])
            endWeek = Number(weekList[i].split("-")[1])
            if (weekType == 0 || weekType == 1) {
                addNum = 2
                if (startWeek % 2 != weekType) startWeek++
            }
            for (let j = startWeek; j <= endWeek; j = j + addNum) {
                weekListOneByOne.push(j)
            }
        } else {
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
        if (classData.length == 0) continue
        let className = $(courseData[count]).text()
        let classList = className.split("---------------------")
        console.log(classList)
        for (let i = 0; i < classList.length; i++)
        {
            let classPartData = {}
            for (let j = i * 3; j < i * 3 + 3; j++)
            {
                var teacherName = ""
                var classroom = ""
                keyWord = $(classData[j]).attr("title")
                //console.log(keyWord)
                if (keyWord == "老师") 
                {
                    teacherName = $(classData[j]).text()
                    classPartData["teacher"] = teacherName
                    classList[i] = classList[i].replace(teacherName, "")
                
                } else if (keyWord == "周次(节次)") {
                    var weekDataOrigin = $(classData[j]).text()
                    //console.log(weekDataOrigin)
                    var weekData = getWeek(weekDataOrigin)
                    //console.log(weekData)
                    classPartData["weeks"] = weekData
                    classList[i] = classList[i].replace(weekDataOrigin, "")

                } else if (keyWord == "教室") {
                    classroom = $(classData[j]).text()
                    classPartData["position"] = classroom
                    classList[i] = classList[i].replace(classroom, "")
                }
            }
            classPartData["name"] = classList[i]
            //week
            if (count) {
                var whichday = (count - 1) % 7 + 1
            } else {
                var whichday = 7
            }
            classPartData["day"] = whichday
            //section
            let whichSection = parseInt(count / 7) + 1
            classPartData["sections"] = [{ section: whichSection }]
            //console.log(classPartData)
            result.push(classPartData)
        }
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

    return { courseInfos: result, sectionTimes: sectionTimesInfos }
}