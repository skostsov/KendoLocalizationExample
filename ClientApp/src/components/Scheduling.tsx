import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { guid } from "@progress/kendo-react-common";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  SchedulerViewChangeEvent,
  SchedulerDateChangeEvent,
  SchedulerDataChangeEvent,
} from "@progress/kendo-react-scheduler";

import {
    sampleDataWithCustomSchema,
    customModelFields,
  } from "./events-utc";

export default class Scheduling extends React.Component<{}, { view: string; date: Date, orientation: "horizontal" | "vertical"; data: any[]; }> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            view: "day",
            date: new Date(),
            orientation: "horizontal",
            data: sampleDataWithCustomSchema,
        };
    }
    
    private handleViewChange = (event: SchedulerViewChangeEvent) => {
        this.setState({
            view: event.value
        });
    }
    
    private handleDateChange = (event: SchedulerDateChangeEvent) => {
        this.setState({
            date: event.value
        });
    }

    private handleDataChange = ({
      created,
      updated,
      deleted,
    }: SchedulerDataChangeEvent) => {
      this.setState((old) => ({
        data: old.data
          .filter(
            (item) =>
              deleted.find((current) => current.TaskID === item.TaskID) ===
              undefined
          )
          .map(
            (item) =>
              updated.find((current) => current.TaskID === item.TaskID) || item
          )
          .concat(
            created.map((item) => Object.assign({}, item, { TaskID: guid() }))
          ),
      }));
    };
    
    render() {
        return (
            <div className="Scheduling Scheduling__root">
                <div className="Scheduling__calendar">
                    <Scheduler
                        data={this.state.data}
                        onDataChange={this.handleDataChange}
                        view={this.state.view}
                        onViewChange={this.handleViewChange}
                        date={new Date(this.state.date)}
                        onDateChange={this.handleDateChange}
                        editable={true}
                        //timezone={timezone}
                        height="100%"
                        modelFields={customModelFields}
                        group={{
                            resources: ["Rooms", "Persons"],
                            orientation: this.state.orientation,
                        }}
                        resources={[
                          {
                            name: "Rooms",
                            data: [
                              { text: "Meeting Room 101", value: 1 },
                              { text: "Meeting Room 201", value: 2, color: "#FF7272" },
                            ],
                            field: "RoomID",
                            valueField: "value",
                            textField: "text",
                            colorField: "color",
                          },
                          {
                            name: "Persons",
                            data: [
                              { text: "Peter", value: 1, color: "#5392E4" },
                              { text: "Alex", value: 2, color: "#54677B" },
                            ],
                            field: "PersonIDs",
                            valueField: "value",
                            textField: "text",
                            colorField: "color",
                          },
                        ]}
                    >
                        {/* <TimelineView /> */}
                        <DayView />
                        <WeekView />
                        <MonthView />
                        {/* <AgendaView /> */}
                    </Scheduler>
                    </div>
                </div>
    );
  }
}