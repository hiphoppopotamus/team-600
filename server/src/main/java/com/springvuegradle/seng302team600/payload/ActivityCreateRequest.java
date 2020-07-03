package com.springvuegradle.seng302team600.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

/**
 * Required to preserve input from client without User class changing values.
 * Password doesn't get converted to an encoded password.
 */
public class ActivityCreateRequest {

    @JsonProperty("activity_name")
    private String name;

    @JsonProperty("description")
    private String description;

    // ToDo fix to the correct mapping
//    @JsonProperty("activity_type")
//    private Set<ActivityType> activityTypes = new HashSet<>();

    @JsonProperty("continuous")
    private boolean continuous;

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("start_time")
    private Date startTime = new Date(0);

    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("end_time")
    private Date endTime = new Date(0);

    @JsonProperty("location")
    private String location;   // ToDo change String to Location in U9


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

//    public Set<ActivityType> getActivityTypes() {
//        return activityTypes;
//    }
//
//    public void setActivityTypes(Set<ActivityType> activityTypes) {
//        this.activityTypes = activityTypes;
//    }

    public boolean isContinuous() {
        return continuous;
    }

    public void setContinuous(boolean continuous) {
        this.continuous = continuous;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}