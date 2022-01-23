// module to find and format date
module.exports.dateGenerator =

    // function to find date
    function () {
        const today = new Date();

        let options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        };

        //render "today" in a readable format

        return today.toLocaleDateString("en-us", options);
    }