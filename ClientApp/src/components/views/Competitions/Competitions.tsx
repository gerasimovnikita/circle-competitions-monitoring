import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IUser, ICompetition, ICompetitionType, Competition } from '../../../@Types/types';
import { Link } from 'react-router-dom';

import Filter from '../Filter';
import CompetitionsList from './CompetitionsList';
import CompetitionDetail from './CompetitionDetail';
import RequestParticipation from './RequestParticipation';

import './Competitions.scss';

interface CompetitionsProps {
    user: IUser;
    competitions: ICompetition[];
    competitionTypes: ICompetitionType[];
    searchString: string;
    selectedType: number | null;
}
interface CompetitionsState {
    selectedCompetition: ICompetition | null;
    checkRequests: boolean;
}

class Competitions extends Component<CompetitionsProps, CompetitionsState>{
    constructor(props: CompetitionsProps) {
        super(props);
        this.state = {
            selectedCompetition: null,
            checkRequests: false
        }
        this.handleChangeCompetition = this.handleChangeCompetition.bind(this);
        this.handleChangeCheckStatus = this.handleChangeCheckStatus.bind(this);
    }

    componentDidMount() {
        this.setState({
            selectedCompetition: this.props.competitions[0] || new Competition()
        })
    }

    componentDidUpdate(prevProps: CompetitionsProps, prevState: CompetitionsState) {
        if (prevProps.competitions.length !== this.props.competitions.length) {
            this.setState({
                selectedCompetition: this.props.competitions[0]
            })
        }
    }

    handleChangeCompetition(id: number) {
        const competition = this.props.competitions.find(c => c.id === id) as Competition;
        this.setState({ selectedCompetition: competition });
    }
    handleChangeCheckStatus() {
        this.setState({
            checkRequests: !this.state.checkRequests
        })
    }

    render() {
        const selectedCompetition = this.state.selectedCompetition;
        let competitions = this.props.competitions;
        const type = this.props.selectedType;
        const search = this.props.searchString;
        const user = this.props.user;
        if (type || search.length > 0) {
            if (type) {
                competitions = competitions.filter(c => c.type === type);
            }
            if (search.length > 0) {
                competitions = competitions.filter(c => c.title.toLowerCase().search(search.toLowerCase()) !== -1);
            }
        }
        return (
            <div className="competitions-container">
                <Filter />
                {user && user.role === 2 ?
                    <Link
                        className="link"
                        to={`/competitions/${0}`}
                        title="Добавить соревнование">
                        <button className="btn btn-secondary">Добавить соревнование</button>
                    </Link>
                    : null}
                <CompetitionsList
                    competitions={competitions}
                    competitionTypes={this.props.competitionTypes}
                    selectedCompetitionId={selectedCompetition ? selectedCompetition.id : 0}
                    changeCompetition={this.handleChangeCompetition} />
                <CompetitionDetail
                    competition={selectedCompetition ? selectedCompetition : new Competition()}
                    handleChangeCheckStatus={this.handleChangeCheckStatus}
                />
                {this.state.checkRequests && selectedCompetition ?
                    <RequestParticipation
                        competiton={selectedCompetition}
                        handleChangeCheckStatus={this.handleChangeCheckStatus}
                    />
                    : null}
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    user: state.user.user,
    competitions: state.competition.competitions,
    competitionTypes: state.filter.types,
    searchString: state.filter.search,
    selectedType: state.filter.selectedType
})

export default connect(mapStateToProps)(Competitions);