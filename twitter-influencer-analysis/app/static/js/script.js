$("#search").on("click" , (e) => {
    e.preventDefault();
    let location = $('#location').val().trim();
    let topic = $('#topic').val().trim();
    if(location && topic)
    {
        let filename = topic + "." + location + "." + new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear()+ '.' + new Date().getTime()
        localStorage.setItem('inputFile',filename)
        localStorage.setItem('outputFile' ,filename)
        $('#search').attr('disabled',true)
        $("#get-file").removeClass('hidden')
        getGeoCode(location , topic ,filename);
    }
    else
        alert("All fields are required")    
})
$("#get-file").on("click" , (e) => getFile());

loader = (container) => {
    container.append($(
        `<div class="w-100 text-center">
            <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>  
        </div>`
    ))
}

handleFile = (users) => {

    let resultContainer = $("#result-container");
    if(users.length <= 0)
        loader(resultContainer)
    else {
        resultContainer.empty()
        for(user of users) {
            resultContainer.append($(`
                <table class="table bg-white mt-4 rounded">
                    <tbody>
                        <tr>
                            <th>Screen name</th>
                            <td>${user.screen_name}</td>
                        </tr>
                        <tr>
                            <th>Followers count</th>
                            <td>${user.followers_count}</td>
                        </tr>
                        <tr>
                            <th>Average retweet count</th>
                            <td>${user.average_retweet_count}</td>
                        </tr>
                        <tr>
                            <th>Verified</th>
                            <td>${user.verified}</td>
                        </tr>
                        <tr>
                            <th>Statuses count</th>
                            <td>${user.statuses_count}</td>
                        </tr>
                    </tbody>
                </table>
            `
            ))
        }
    }
}

getFile = () => {
    let file = localStorage.getItem('outputFile')
    handleFile([])
    $.ajax({
        url: `/getFile?file=${file}`,
        method: "GET"
    })
    .then(res => handleFile(res.users))
    .catch(err => showerror(err))
    $('#search').attr('disabled',false)
}

getGeoCode = (location , topic ,filename) => {
    // sk - AIzaSyCP74c1YI3sYpyIzYvzEuJGu81ePQvMFug
    // me - AIzaSyCyZPZiKVHSFLowotbQbz4VlCiQug11pEo
    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?&address=${location}&key=AIzaSyCyZPZiKVHSFLowotbQbz4VlCiQug11pEo`,
        method: "GET"
    })
    .then(res =>{
        location = res.results["0"].geometry.location.lat + ","+res.results["0"].geometry.location.lng+",150km"
        generateInputFile(location , topic ,filename)
    })
    .catch(err => showerror(err))
}
generateInputFile = (location , topic , filename ) => {
    $.ajax({
        url: `/generateInputFile?location=${location}&topic=${topic}&file=${filename}`,
        method: "GET"
    })
    .then(res =>{ uploadFileToHDFS(filename)
    
    })
    .catch(err => showerror(err))
}

uploadFileToHDFS= (filename) => {
    $.ajax({
        url: `/uploadFileToHDFS?file=${filename}`,
        method: "GET"
    })
    .then(res => startJob(filename))
    .catch(err => showerror(err))
}

startJob= (filename) => {
    $.ajax({
        url: `/startJob?file=${filename}`,
        method: "GET"
    })
    .then(res => alert("Map Reduce job started"))
    .catch(err => showerror(err))
}

showerror = (err) => {
    console.log(err);
    alert("Something went wrong! Check console")
    $('#search').attr('disabled',false)

}