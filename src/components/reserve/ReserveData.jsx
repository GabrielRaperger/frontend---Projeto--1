import React from "react";
import axios from "axios";
import Content from "../template/Content";
import { useParams } from "react-router";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "../template/AccordionHeader";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import If from "../template/If";
import {
  convertSecondsToHoursAndMinutes,
  formatDateToISO,
  formatDateToReadble,
  formatDateToString,
  getCurrentAsISO,
  isAfter,
} from "../../config/moment";

const initState = {
  Reserv: {},
  statusIcon: "",
  statusColor: "",
  statusAction: "",
  reserveBadgeColor: "success",
  reserveBadgeText: "Pendente",
  displayEditButton: false,
};

class ReservData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }
  componentDidMount() {
    const id = this.props.params.id;
    this.loadReserv(id);
  }
  async loadReserv(id) {
    const url = `${baseApiUrl}/reserve/${id}`;
    await axios
      .get(url)
      .then(async (res) => {
        this.setState({ Reserv: res.data }, () => {
          this.formatReserveStatus();
        });
        
      })
      .catch(showError);
  }
  deleteReserv() {
    const a = this.props.params.id;

    var config = {
      method: "delete",
      url: `${baseApiUrl}/reserve/${a}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(() => {
        showSuccess("Centro excluído com sucesso");
        this.props.navigate(`/reserv-table`);
      })
      .catch(showError);
  }
  convertSecondsToHours(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
  }
  formatReserveStatus() {
    const reserve = this.state.Reserv;
    if (reserve) {
      const endDateTime = formatDateToISO(
        `${formatDateToString(reserve.date)} ${convertSecondsToHoursAndMinutes(
          reserve.end_time
        )}`
      );
      var current = getCurrentAsISO();
      if (reserve.status_id == 100) {
        if (isAfter(endDateTime, current)) {
          this.setState({
            reserveBadgeColor: "success",
            reserveBadgeText: "Pendente",
            displayEditButton: true,
          });
        } else {
          this.setState({
            reserveBadgeColor: "primary",
            reserveBadgeText: "Concluída",
            displayEditButton: false,
          });
        }
      } else {
        this.setState({
          reserveBadgeColor: "secondary",
          reserveBadgeText: "Inativa",
          displayEditButton: isAfter(endDateTime, current),
        });
      }
    }
  }
  renderAccordion() {
    return (
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <AccordionHeader
              icon="fa fa-calendar-check-o"
              title={this.state.Reserv.title}
            />
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              <div className="col-md-4">
                <h6>Localização</h6>
                <p>
                  {this.state.Reserv.room ? this.state.Reserv.room.name : ""}
                </p>
              </div>
              <div className="col-md-4">
                <h6>Autor da Reserva</h6>
                <p>
                  {this.state.Reserv.account
                    ? this.state.Reserv.account.name
                    : ""}
                </p>
              </div>
              <div className="offset-md-2 col-md-2">
                <h6>Ações</h6>
                <If test={this.state.displayEditButton}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Editar</Tooltip>}
                  >
                    <Link
                      className="btn btn-link"
                      to={`/reserve-form/${this.props.params.id}`}
                    >
                      <i className="fa fa-pencil text-primary"></i>
                    </Link>
                  </OverlayTrigger>
                </If>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Excluir</Tooltip>}
                >
                  <button
                    className="btn btn-link"
                    onClick={() => this.deleteReserv()}
                  >
                    <i className="fa fa-trash text-danger"></i>
                  </button>
                </OverlayTrigger>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <div>
                  <h6>Estado</h6>
                  <Badge pill bg={this.state.reserveBadgeColor}>
                    {this.state.reserveBadgeText}
                  </Badge>
                </div>
              </div>
              <div className="col-md-4">
                <h6>Data</h6>
                {formatDateToReadble(this.state.Reserv.date)}
              </div>
              <div className="offset-md-2 col-md-2">
                <h6>Horário</h6>
                {this.convertSecondsToHours(
                  this.state.Reserv.start_time
                )} - {this.convertSecondsToHours(this.state.Reserv.end_time)}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
  render() {
    return <Content>{this.renderAccordion()}</Content>;
  }
}

export default function Reserv(props) {
  let params = useParams();
  let navigate = useNavigate();
  return <ReservData {...props} params={params} navigate={navigate} />;
}
