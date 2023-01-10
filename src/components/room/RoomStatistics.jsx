import "./Room.css";
import "../template/StatCard.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import React from "react";
import ReactApexChart from "react-apexcharts";
import Form from "react-bootstrap/Form";
import { baseApiUrl, showError } from "../../config/global";
import StatCard from "../template/StatCard";
import { convertSecondsToHours, formatDateToString } from "../../config/moment";
import pt from "date-fns/locale/pt";

const INIT_STATE = {
  time: "day",
  series: [],
  options: {},
  averageDuration: "",
  startDate: null,
  endtDate: null,
  total_reserves: 0,
  pending_reserves: 0,
  completed_reserves: 0,
};

export default class RoomStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE };
    registerLocale("pt", pt);
  }
  componentDidMount() {
    this.loadOcupationPercent();
    this.getAverageCleaningDuration();
    this.countReserves();
  }
  loadOcupationPercent() {
    const room_id = this.props.id;
    const time = this.state.time;
    axios
      .get(
        `${baseApiUrl}/room/statistics/ocupation?time=${time}&room_id=${room_id}`
      )
      .then((res) => {
        const data = res.data.ocupation;
        const keys = Object.keys(data);
        const values = Object.values(data);
        const title = time == "day" ? "Ocupação diária" : "Ocupação mensal";
        this.setState({
          series: [
            {
              name: "Ocupação (%)",
              data: [...values],
            },
          ],
          options: {
            chart: {
              height: 380,
              type: "line",
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "straight",
            },
            title: {
              text: title,
              align: "left",
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: [...keys],
            },
            yaxis: {
              min: 0,
              max: 100,
              labels: {
                formatter: function (value) {
                  return value + "%";
                },
              },
            },
          },
        });
      })
      .catch(showError);
  }
  getAverageCleaningDuration() {
    const room_id = this.props.id;
    axios
      .get(`${baseApiUrl}/cleaning/statistics/average?room_id=${room_id}`)
      .then((res) => {
        const averageDuration = res.data.averageDuration;
        const formated = convertSecondsToHours(averageDuration);
        this.setState({ averageDuration: formated });
      })
      .catch(showError);
  }
  countReserves() {
    const room_id = this.props.id;
    const startDate = this.state.startDate;
    const endtDate = this.state.endtDate;
    var params = `room_id=${room_id}`;
    if (startDate) {
      const date = formatDateToString(startDate);
      params = params.concat(`&start_date=${date}`);
    }
    if (endtDate) {
      const date = formatDateToString(endtDate);
      params = params.concat(`&end_date=${date}`);
    }
    axios
      .get(`${baseApiUrl}/reserve/statistics/count?${params}`)
      .then((res) => {
        const totalReserves = res.data.total_reserves;
        const pendingReserves = res.data.pending_reserves;
        const completedReserves = res.data.completed_reserves;
        this.setState({ total_reserves: totalReserves });
        this.setState({ pending_reserves: pendingReserves });
        this.setState({ completed_reserves: completedReserves });
      })
      .catch(showError);
  }
  updateTime(event) {
    const value = event.target.value;
    this.setState({ time: value }, () => {
      this.loadOcupationPercent();
    });
  }
  updateStartDate(date) {
    this.setState({ startDate: date });
  }
  updateEndDate(date) {
    this.setState({ endtDate: date });
  }
  render() {
    var { options, series, averageDuration, startDate, endtDate } = this.state;
    return (
      <div className="row">
        <div className="col-md-7">
          <Form.Select
            value={this.state.time}
            name="time"
            onChange={(event) => this.updateTime(event)}
          >
            <option value={"day"}>Diária</option>
            <option value={"month"}>Mensal</option>
          </Form.Select>
          <ReactApexChart
            className="mt-4"
            options={options}
            series={series}
            type="line"
          />
        </div>
        <div className="col-md-5">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-4">
                  <DatePicker
                    className="form-control "
                    name="startDate"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Data Inicial"
                    locale="pt"
                    selected={startDate}
                    onChange={(date) => this.updateStartDate(date)}
                  />
                </div>
                <div className="col-4">
                  <DatePicker
                    className="form-control"
                    name="endDate"
                    placeholderText="Data Final"
                    dateFormat="dd/MM/yyyy"
                    locale="pt"
                    selected={endtDate}
                    onChange={(date) => this.updateEndDate(date)}
                  />
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-dark"
                    onClick={() => this.countReserves()}
                  >
                    Pesquisar
                  </button>
                </div>
              </div>
              <StatCard
                className="mt-4"
                title="Número de reservas"
                icon="fa fa-calendar-check-o"
                text="Total"
                hasExtra={true}
                value={`${this.state.total_reserves}`}
                positive={`Pendentes: ${this.state.pending_reserves}`}
                negative={`Concluídas: ${this.state.completed_reserves}`}
              />
            </div>
            <div className="col-12">
              <StatCard
                title="Tempo médio de limpeza"
                icon="fa fa-clock-o"
                text="Total"
                value={`${averageDuration}`}
                hasExtra={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
