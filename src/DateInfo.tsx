import React from 'react';
const DateInfo:React.FC = () => {
    const date = new Date();
    const currentDateString = date.toLocaleDateString();

    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const nextWeekString = nextWeek.toLocaleDateString();

    return (
        <>
        <div className="ui basic grey label">
            <i className="calendar alternate outline icon"></i>{currentDateString}
        </div>{" "}
        <i className="ui icon grey angle double right"></i>
        <div className="ui basic grey label">
            <i className="calendar plus alternate outline icon"></i>{nextWeekString}
        </div>
        </>
    )

}

export default DateInfo;