import { ICircle, IResult, IStage } from "../@Types/types";

class ResultService {
    /**
     * Сохранение результата в БД
     * @param {IResult} result - результат, который необходимо сохранить
     * @return {Promes<IResult>}
     */
    public SaveResult(res: IResult): Promise<IResult> {
        const token = localStorage.getItem("access_token");
        return new Promise((result, error) => {
            fetch(`/Result/SaveResult`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(res)
            })
                .then(response => {
                    if (response.status !== 200) {
                        throw Error("Ошибка при сохранении результата");
                    } else {
                        return response.json();
                    }
                })
                .then(data => result(data))
                .catch(err => error(err))
        })
    }
    /**
     * Сохранение стадии в БД
     * @param {IStage} stage - стадия, которую необходимо сохранить
     * @return {Promise<IStage>} 
     */
    public SaveStage(stage: IStage): Promise<IStage> {
        const token = localStorage.getItem("access_token");
        return new Promise((result, error) => {
            fetch(`/Result/SaveStage`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(stage)
            })
                .then(response => {
                    if (response.status !== 200) {
                        throw Error("Ошибка при сохранении стадии");
                    } else {
                        return response.json();
                    }
                })
                .then(data => result(data))
                .catch(err => error(err))
        })
    }
    /**
     * Сохрание кругов в БД
     * @param {ICircle[]} circles - круги, которые необходимо сохранить
     * @return {Promise<ICircle[]>}
     */
    public SaveCircles(circles: ICircle[]): Promise<ICircle[]> {
        const token = localStorage.getItem("access_token");
        return new Promise((result, error) => {
            fetch(`/Result/SaveCircles`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(circles)
            })
                .then(response => {
                    if (response.status !== 200) {
                        throw Error("Ошибка при сохранении кругов");
                    } else {
                        return response.json();
                    }
                })
                .then(data => result(data))
                .catch(err => error(err))
        })
    }
}

export default new ResultService();