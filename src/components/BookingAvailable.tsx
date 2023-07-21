import { Booking } from "./interface";
import BookingData from "./booking-data.json";
import { DatePicker, Form, Select, TimePicker } from "antd";
import { useState } from "react";
import { Dayjs } from "dayjs";

const isRoomAvailable = (
    room: string,
    startTime: Date,
    endTime: Date,
    bookings: Booking[]
): boolean => {
    const requestedStartTime = startTime;
    const requestedEndTime = endTime;
    const conflictingBooking = bookings.find((booking) => {
        const bookingStartTime = new Date(booking.startTime);
        const bookingEndTime = new Date(booking.endTime);
        return (
            booking.roomId === room &&
            ((requestedStartTime >= bookingStartTime && requestedStartTime < bookingEndTime) ||
                (requestedEndTime > bookingStartTime && requestedEndTime <= bookingEndTime) ||
                (requestedStartTime <= bookingStartTime && requestedEndTime >= bookingEndTime))
        );
    });
    console.log(conflictingBooking)
    return !conflictingBooking;
};

const getBookingsForDateRange = (
    room: string,
    startDate: Date,
    endDate: Date,
    bookings: Booking[]
): Booking[] => {
    return bookings.filter((booking) => {
        const bookingStartTime = new Date(booking.startTime);
        const bookingEndTime = new Date(booking.endTime);
        return (
            booking.roomId === room &&
            ((bookingStartTime >= startDate && bookingStartTime <= endDate) ||
                (bookingEndTime >= startDate && bookingEndTime <= endDate) ||
                (bookingStartTime <= startDate && bookingEndTime >= endDate))
        );
    });
};
const BookingAvailable = () => {
    const [selectedRoom, setSelectedRoom] = useState<string>('A101');
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<Dayjs | null>(null); 
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null); 
    const [selectedEndTime, setSelectedEndTime] = useState<Dayjs | null>(null); 
    
    let isAvailable
    let flagAvailable
    const handleRoomChange = (value: string) => {
        setSelectedRoom(value);
        setSelectedStartDate(null);
        setSelectedStartTime(null);
        setSelectedEndDate(null);
        setSelectedEndTime(null);
    };
    const handleStartDatePickerChange = (date: Dayjs | null) => { 
        setSelectedStartDate(date);
    };
    const handleStartTimePickerChange = (time: Dayjs | null) => {
        setSelectedStartTime(time);
    };
    const handleEndDatePickerChange = (date: Dayjs | null) => { 
        setSelectedEndDate(date);
    };
    const handleEndTimePickerChange = (time: Dayjs | null) => {
        setSelectedEndTime(time);
    };
    if (selectedRoom && selectedStartDate && selectedStartTime && selectedEndDate && selectedEndTime) {
        const room = selectedRoom;
        const startTime = selectedStartTime.toDate();
        const startDate = selectedStartDate.toDate();
        startDate.setHours(startTime.getHours());
        startDate.setMinutes(startTime.getMinutes());
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        console.log("startDate Class ",startDate)
        const endTime = selectedEndTime.toDate();
        const endDate = selectedEndDate.toDate(); 
        endDate.setHours(endTime.getHours());
        endDate.setMinutes(endTime.getMinutes());
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        console.log("endDate Class ",endDate)

        isAvailable = isRoomAvailable(room, startDate, endDate, BookingData);
        console.log('Room Availability Status:', isAvailable);
        flagAvailable = isAvailable ? "Available" : "Not Available";
    }
    const room = selectedRoom
    const today = new Date();
    const thisWeekStartDate = new Date(today);
    thisWeekStartDate.setDate(thisWeekStartDate.getDate() - today.getDay());
    const thisWeekEndDate = new Date(thisWeekStartDate);
    thisWeekEndDate.setDate(thisWeekEndDate.getDate() + 7);
    const nextWeekStartDate = new Date(thisWeekEndDate);
    const nextWeekEndDate = new Date(nextWeekStartDate);
    nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 7);

    const bookingsThisWeek = getBookingsForDateRange(room, thisWeekStartDate, thisWeekEndDate, BookingData);
    const bookingsNextWeek = getBookingsForDateRange(room, nextWeekStartDate, nextWeekEndDate, BookingData);

    console.log("Bookings this week:", bookingsThisWeek);
    console.log("Bookings next week:", bookingsNextWeek);

    return (
        <div>
            <Form.Item label="Room">
                <Select value={selectedRoom} onChange={handleRoomChange}>
                    <Select.Option value="A101">A101</Select.Option>
                    <Select.Option value="A102">A102</Select.Option>
                    <Select.Option value="Auditorium">Auditorium</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Start">
                <DatePicker onChange={handleStartDatePickerChange} value={selectedStartDate} />
                <TimePicker format={'HH:00'} onChange={handleStartTimePickerChange} value={selectedStartTime} />
            </Form.Item>
            <Form.Item label="End">
                <DatePicker onChange={handleEndDatePickerChange} value={selectedEndDate}/>
                <TimePicker format={'HH:00'} onChange={handleEndTimePickerChange} value={selectedEndTime} />
            </Form.Item>
            <p>Status : {flagAvailable}</p>
        </div>
    );
};

export default BookingAvailable;