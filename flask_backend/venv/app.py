from flask import Flask, render_template, request, jsonify, make_response, session
from flask_sqlalchemy import SQLAlchemy

from flask_cors import CORS, cross_origin


from flask_migrate import migrate, Migrate

from datetime import datetime, timedelta

import json


import jwt


from flask_bcrypt import Bcrypt

from functools import wraps


import flask_praetorian


# .........
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

import pandas as pd

import math

Base = automap_base()

engine = create_engine('postgresql://postgres:Dev%40123@localhost:5432/rest_job_app')


Base.prepare(autoload_with = engine)


Select = Base.classes.job_selectmaster
Option = Base.classes.job_optionmaster
City = Base.classes.job_citymaster
State = Base.classes.job_statemaster

session = Session(engine)


guard = flask_praetorian.Praetorian()


db = SQLAlchemy()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"]= 'postgresql://postgres:Dev%40123@localhost:5432/flask_db'

app.config["SQLALCHEMY_BINDS"]={"dropdown": 'postgresql://postgres:Dev%40123@localhost:5432/rest_job_app'}

app.config["SECRET_KEY"] ="12345678"

db.init_app(app)

CORS(app)

bcrypt= Bcrypt(app)  # for password hashing

migrate = Migrate(app,db)


app.config['JWT_ACCESS_LIFESPAN'] = {'hours' : 24}

app.config['JWT_REFRESH_LIFESPAN'] = {'days' : 30}


# with app.app_context():
#     db.Model.metadata.reflect(engine)
#     print(" db.Model.metadata.tables@@@@@@",  db.Model.metadata.tables["job_selectmaster"])

# class State(db.Model):
#     __bind_key__ = "dropdown"
#     __table__ = db.Model.metadata.tables['job_selectmaster']
    


class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable= False)
    password = db.Column(db.String, unique= False, nullable = False)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, email):
        return cls.query.filter_by(email=email).one_or_none()


    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id    



guard.init_app(app, User)    






# MODELS.....
class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key= True)
    fname = db.Column(db.String, nullable = False)
    lname = db.Column(db.String, nullable= False)
    surname = db.Column(db.String, nullable= False)
    contact_no = db.Column(db.Integer, nullable= False)
    city = db.Column(db.String, nullable= False)
    state = db.Column(db.String, nullable = False)
    email = db.Column(db.String, nullable = False)
    dob = db.Column(db.String, nullable= False)
    gender = db.Column(db.String, nullable = False)
    academics = db.relationship("Academic", backref= 'candidate')
    experiences = db.relationship("Experience", backref = 'candidate')
    languages = db.relationship("Language", backref= 'candidate')
    technologies = db.relationship("Technology", backref = 'candidate')
    references = db.relationship("Reference", backref='candidate')
    preferences = db.relationship("Preference", backref = 'candidate')

    created_at = db.Column(db.String, nullable = False, default= datetime.utcnow)



class Academic(db.Model):
    id= db.Column(db.Integer, primary_key = True)
    course_name = db.Column(db.String, unique = False, nullable = False)
    name_of_board_university = db.Column(db.String, unique=False, nullable= False)
    passing_year = db.Column(db.Integer, unique = False , nullable = False)
    percentage = db.Column(db.Integer, unique = False, nullable = False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))


class Experience(db.Model):
    id= db.Column(db.Integer, primary_key = True)
    company_name = db.Column(db.String, unique= False, nullable= False)
    designation = db.Column(db.String, unique= False, nullable = False)
    from_date =  db.Column(db.DateTime, unique = False, nullable = False)
    to_date = db.Column(db.DateTime, unique = False, nullable = False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))



class Language(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    language = db.Column(db.String, unique= False, nullable = False)
    read = db.Column(db.Boolean, unique = False, default= False)
    write = db.Column(db.Boolean, unique=False, default=False)
    speak = db.Column(db.Boolean, unique=False, default=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))



class Technology(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    technology = db.Column(db.String, unique = False, nullable = False)
    ranting = db.Column(db.Integer, unique= False, nullable = False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))


class Reference(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    refe_name = db.Column(db.String, unique = False, nullable = False)
    refe_contact_no = db.Column(db.Integer, unique = False , nullable = False)
    refe_relation = db.Column(db.String, unique = False, nullable= False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))


class Preference(db.Model):
    id= db.Column(db.Integer, primary_key = True)
    prefer_location = db.Column(db.String, unique = False, nullable =  False)
    notice_period = db.Column(db.Integer,  unique = False, nullable = False)
    expected_ctc = db.Column(db.Integer,  unique = False, nullable = False)
    current_ctc = db.Column(db.Integer,  unique = False, nullable = False)
    department = db.Column(db.String,  unique = False, nullable = False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))






#  token required

def token_required(fun):
    @wraps(fun)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({"data":"Token is missing"})
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({"data":"Invalid token!"})   

    return decorated             

















@app.route("/register/", methods=["POST"])
def register():
    register_data = json.loads(request.data.decode('utf-8'))
    username = register_data["username"]
    password = register_data["password"]

    user_obj = User.query.filter_by(email = username).first()
    # print("user_obj:::", user_obj)

    if user_obj:
        return make_response({"data":"", "message":"User already exists!"}, 200)

    hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email = username, password = hashed_pwd)
    db.session.add(user)
    db.session.commit()
    return make_response({"data":"", "message":"Successfully register!"}, 200)






@app.route("/login/", methods=["POST"])
@cross_origin()
def login():   

    login_data = json.loads(request.data.decode('utf-8'))
    # print("login data", login_data)
    username = login_data["username"]
    password = login_data["password"]

    try:
        user = guard.authenticate(username, password)
        # print("userrrrr::::", user)
        return make_response({'access_token': guard.encode_jwt_token(user)}, 200)

    except:
        return make_response({"data":"", "message":"No active account found with the given credentials!"}, 200)   
 

    # if user: 
    #     return make_response({'access_token': guard.encode_jwt_token(user)}, 200)
    # else:

    #     return make_response({"data":"", "message":"No active account found with the given credentials!"}, 200)   
 



    # user = User.query.filter_by(email = username).first()

    # if user and bcrypt.check_password_hash(user.password,password):
    #     session["is_logged_in"] = True
    #     token = jwt.encode({
    #         'user':username,
    #         'expiration': str(datetime.utcnow() + timedelta(seconds = 120))
    #     }, app.config["SECRET_KEY"])

    #     json_token = json.dumps({'token': token.decode('utf-8')})
    #     return make_response({"data":json_token, "message":"successfully login!"}, 200)

    # return  make_response({"data":"", "message":"No active account found with the given credentials!"}, 200)   



    # if username == "ram@gmail.com" and password == "12345678":
    #     print("TTTTTTTTTTTTTTTTTTTTTTT")
    #     session["is_logged_in"] = True
    #     token = jwt.encode({
    #         'user':username,
    #         'expiration': str(datetime.utcnow() + timedelta(seconds = 120))
    #     }, app.config["SECRET_KEY"])

    #     json_token = json.dumps({'token': token.decode('utf-8')})

    #     print("OOOOOOOOOOOOOOOOOOOOOOOOOOOtoken", json_token )
 


    #     return make_response(json_token, 200)

    #     # return f"successFullu login {token}"
    # return make_response({"data":"error while login"}, 200)



@app.route("/refresh", methods=["POST"])
def refresh():
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    return make_response({'access_token': new_token}, 200)



# .....................................all drop down data.........


@app.route("/select_all/<id>", methods=["GET"])
def select_all(id):
    try:
        result = session.query(Option).filter_by(select_id = id)
        data = json.dumps([{i:v for i, v in r.__dict__.items() if i in r.__table__.columns.keys()} for r in result])    
        # print("PPP", json.loads(data))
        return make_response({"data": json.loads(data), "message":"Success"}, 200)
    except:
        return make_response({"data":"", "message": "Error while fetching dropdown data!!"}, 200)    


@app.route("/fetch_state/")
def fetch_state():

    try:
        res = session.query(State).all()
        data = json.dumps([{i:v for i, v in r.__dict__.items() if i in r.__table__.columns.keys()} for r in res])    
        # print("PPP", json.loads(data))
        return make_response({"data": json.loads(data), "message":"Success"}, 200)
    except:
        return make_response({"data":"", "message": "Error while fetching state data!!"}, 200)  


@app.route("/fetch_city/", methods=["POST"])
def fetch_city():
    try:
        req = json.loads(request.data.decode('utf-8'))
        state = req["state"]
   
        # print("State in request:   ", state)
        result = session.query(State).filter_by(name=state)
        state_obj = json.dumps([{i:v for i, v in r.__dict__.items() if i in r.__table__.columns.keys()} for r in result])    
        # print("STATEEEEE :::", json.loads(state_obj)[0]["id"])
        state_id = json.loads(state_obj)[0]["id"]
        # print("State object and state id", state_obj, state_id)
        city_data = session.query(City).filter_by(state_id = state_id) 
        city_obj = json.dumps([{i:v for i, v in r.__dict__.items() if i in r.__table__.columns.keys()} for r in city_data])    
        # print("City obj:     ", city_obj) 


        return make_response({"data": json.loads(city_obj), "message":"Success"}, 200) 
    
    except:

        return make_response({"data":"", "message": "Error while fetching city data!!"}, 200)  

# HOME PAGE.....
@app.route('/home')
# @token_required
@flask_praetorian.auth_required
def home():
    # return render_template("home.html")
    print("Calllllled")
    return make_response({"data":"Hello", "message":"token verified!"}, 200)   


# CREATE CANDIDATE......
@app.route('/create_candidate', methods= ['POST'])
@flask_praetorian.auth_required
def create_candidate():
    
    try:
        print("In try req?::::", request)
        print("In try req json method?::::", request.method)


        # print("In try req body?::::fname",request.data.decode('utf-8'))

        candidate = request.get_json(force=True)
        # candidate = json.loads(request.data.decode('utf-8'))
        print("RRRRRRRR",candidate['fname'] )

        


        cand_obj = Candidate(fname=candidate['fname'],
                         lname = candidate["lname"],
                         surname = candidate["surname"],
                         contact_no = candidate["phone"],
                         gender = candidate["gender"],
                         email = candidate["email"],
                         city = candidate["city"],
                         state = candidate["state"],
                         dob = candidate["dob"]

                         )
        print("BEFORE::::", cand_obj)                 
        db.session.add(cand_obj)
        db.session.commit()
        print("COMIIITEDDDD!!", cand_obj.id)
        # data = json.dumps([{i:v for i, v in cand_obj.__dict__.items() } ]) 
        print("AFTER::::", )        
        return make_response({"data":cand_obj.id, "message":"Successfully created candidate"}, 200)
        # return f"Successfully created!! {cand_obj}"
    except:
        return make_response({"data":"", "message":"Error while creating candidate in backend"}, 200)    



@app.route("/create_academic", methods=["POST"])
@flask_praetorian.auth_required
def create_academic():
    print("Create academics is called!!!")
    # academic = json.loads(request.data.decode('utf-8'))
    try:
        academic = request.get_json(force=True)
        print("ACADEMIC:", academic['academic']['courseName'])
        acad_obj = Academic(course_name = academic['academic']["courseName"],
                            name_of_board_university = academic['academic']["nameOfBoardUniversity"],
                            passing_year = academic['academic']["passingYear"],
                            percentage = academic['academic']["percentage"],
                            candidate_id = academic["candidate"]
                            )

        db.session.add(acad_obj)
        db.session.commit()
        return make_response({"data":acad_obj.id, "message":"Successfully created candidate"}, 200)

    except:
         return make_response({"data":"Error", "message":"Error while creating academic in backend"}, 200)    



@app.route("/create_experience", methods=["POST"])
@flask_praetorian.auth_required
def create_experience():
    print("Create experience is called!!!!!!!!!")
        
    try:
        experience = request.get_json(force=True)
        print("EXPERIENCE:", experience['experience']['companyName'])

        expe_obj = Experience(company_name = experience['experience']["companyName"],
                          designation = experience['experience']["designation"],
                          from_date = experience['experience']["from"],
                          to_date = experience['experience']["to"],
                          candidate_id = experience["candidate"]
                          )

        db.session.add(expe_obj)
        db.session.commit()

        return make_response({"data":expe_obj.id, "message":"Successfully created candidate"}, 200)

    except:
        return make_response({"data":"Error", "message":"Error while creating experience in backend"}, 200)    






@app.route("/create_language", methods=["POST"])
@flask_praetorian.auth_required
def create_language():

    try:

        language = request.get_json(force=True)
        print("LANGUAGE:", language['language']['languageName'][0], "LANGUAGE WRITE:",language['language']["write"])

        lang_obj = Language(language= language['language']["languageName"][0],
                        read = language['language']['read'],
                        write = language['language']["write"],
                        speak = language['language']['speak'],
                        candidate_id=language["candidate"]
                        )


        db.session.add(lang_obj)
        db.session.commit()

        
        return make_response({"data":lang_obj.id, "message":"Successfully created candidate"}, 200)

    except:
        return make_response({"data":"Error", "message":"Error while creating language in backend"}, 200)    




@app.route("/create_technology", methods=["POST"])
@flask_praetorian.auth_required
def create_techmology():
     try:

        technology = request.get_json(force=True)
        print("TECHNOLOGY:", technology['technology']['technologyName'][0])


        tech_obj = Technology(technology = technology['technology']["technologyName"][0],
                          ranting = technology['technology']["rating"],
                          candidate_id=technology["candidate"]
                          )

        db.session.add(tech_obj)

        db.session.commit()


        return make_response({"data":tech_obj.id, "message":"Successfully created candidate"}, 200)

     except:
        return make_response({"data":"Error", "message":"Error while creating technology in backend"}, 200)    




@app.route("/create_reference", methods= ["POST"])
@flask_praetorian.auth_required
def create_reference():

     try:

        reference = request.get_json(force=True)
        print("REFERENCE:", reference['reference']['name'])

   

        refe_obj = Reference(refe_name = reference['reference']["name"],
                         refe_contact_no = reference['reference']["contactNo"],
                         refe_relation = reference['reference']["relation"],
                         candidate_id=reference["candidate"]
                         )


        db.session.add(refe_obj)
        db.session.commit()

        return make_response({"data":refe_obj.id, "message":"Successfully created candidate"}, 200)

     except:
        return make_response({"data":"Error", "message":"Error while creating reference in backend"}, 200)    






@app.route("/create_preference", methods=["POST"])
@flask_praetorian.auth_required
def create_preference():

     try:

        preference = request.get_json(force=True)
        print("PREFERENCE:", preference['location'])
    

        pref_obj = Preference(prefer_location = preference['location'],
                          notice_period = preference["noticePeriod"],
                          expected_ctc = preference["expectedCTC"],
                          current_ctc = preference["currentCTC"],
                          department = preference["department"],
                          candidate_id = preference["candidate"]

                          )

        db.session.add(pref_obj)
        db.session.commit()

        return make_response({"data":pref_obj.id, "message":"Successfully created candidate"}, 200)

     except:
        return make_response({"data":"Error", "message":"Error while creating preference in backend"}, 200)    











# SHOW CANDIDATES
@app.route('/show_candidates', methods=['GET'])
@flask_praetorian.auth_required
def show_candidates():
    all_candidates = db.session.execute(db.select(Candidate)).all()
    cand = []

    # print("all_candidates:::", all_candidates[0][0].fname, "json::::", cand)
     
    for candidate in all_candidates:
        # print("candidate[0].academics:::::::::::::::::::::::::::::::::::::::", candidate[0].academics)
        c = {
            'fname': candidate[0].fname,
            'lname': candidate[0].lname,
            'surname' : candidate[0].surname,
            'contact_no': candidate[0].contact_no,
            'city': candidate[0].city,
            'state': candidate[0].state,
            'gender' : candidate[0].gender,
            'email' : candidate[0].email,
            'dob': candidate[0].dob,
            'academics': [{"course_name" : aca.course_name,
                           "name_of_board_university" : aca.name_of_board_university,
                           "passing_year" : aca.passing_year,
                           "percentage": aca.percentage
                           } for aca in candidate[0].academics ],

            'experiences' : [{"company_name" : exe.company_name,
                              "designation" : exe.designation,
                              "from_date": exe.from_date,
                              "to_date":exe.to_date} for exe in candidate[0].experiences ],

            'languages' : [{"language": lan.language,
                            "read": lan.read,
                            "write": lan.write,
                            "speak": lan.speak} for lan in candidate[0].languages ],


            "technologies" : [{"technology": tec.technology,
                               "ranting": tec.ranting} for tec in candidate[0].technologies ],

            "references" : [{"refe_name": ref.refe_name,
                             "refe_contact_no": ref.refe_contact_no,
                             "refe_relation": ref.refe_relation} for ref in candidate[0].references ],


            "preferences" : [{"prefer_location" : pre.prefer_location,
                              "notice_period" : pre.notice_period,
                              "expected_ctc": pre.expected_ctc,
                              "current_ctc": pre.current_ctc,
                              "department" : pre.department} for pre in candidate[0].preferences ]


        }
        cand.append(c)
        # print("all_candidates:::", all_candidates,"json::::", cand)


    return cand





# ..........................................pagination.........................
@app.route("/pagination/", methods=["GET"])
def pagination():
    per_page = 10
    page = request.args.get("page", 1)
    order = request.args.get("order")
    sort = request.args.get("sort")
    print("ASSASSASAS:   ", order, sort, page)
    pages= int(page)
    if order and sort and sort == 'fname':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.fname), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.fname.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)

    elif order and sort and sort == 'lname':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.lname), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.lname.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)
    
    elif order and sort and sort == 'surname':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.surname), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.surname.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)

    elif order and sort and sort == 'contact_no':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.contact_no), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.contact_no.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)

    elif order and sort and sort == 'email':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.email), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.email.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)


    elif order and sort and sort == 'state':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.state), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.state.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)

    elif order and sort and sort == 'city':
        paginated_data = db.paginate(Candidate.query.order_by(Candidate.city), page=pages, per_page=per_page) if order == 'asc' else db.paginate(Candidate.query.order_by(Candidate.city.desc()), page=pages, per_page=per_page)

        print("Paginated_data::", paginated_data.total)

    

    else:

        paginated_data = db.paginate(Candidate.query.order_by(Candidate.id), page=pages, per_page=per_page)
        print("Paginated_data::", paginated_data.total)

    cand = []
    for i in paginated_data:
        print("Pageeee: ", i)
        c = {
            "id" : i.id,
            'fname': i.fname,
            'lname': i.lname,
            'surname' : i.surname,
            'contact_no': i.contact_no,
            'city': i.city,
            'state': i.state,
            'gender' : i.gender,
            'email' : i.email,
            'dob': i.dob,
        }
        cand.append(c)
    no_of_pages = math.ceil(paginated_data.total/per_page)
    data ={
        "data":cand,
        "total":paginated_data.total,
        "no_of_pages":no_of_pages
    } 

    return make_response({"data":data, "message": "Success pagination"}, 200)










# UPDATE............................
@app.route("/update_candidate/<id>", methods=["POST"])
@flask_praetorian.auth_required
def update_candidate(id):
    updated_data = json.loads(request.data.decode('utf-8'))
    candidate = db.get_or_404(Candidate, id)
    # print("..............candidate", candidate, "updated data::::::", updated_data )
    candidate.fname = updated_data['fname']
    candidate.lname = updated_data['lname']
    candidate.surname = updated_data['surname']
    candidate.contact_no = updated_data['contact_no']
    candidate.city = updated_data['city']
    candidate.state = updated_data['state']
    candidate.gender = updated_data['gender']
    candidate.email = updated_data['email']
    candidate.dob = updated_data['dob']

    db.session.commit()
    print(";;;;;;", candidate.fname)
    return "Candidates Successfully updated!!"



@app.route("/update_academics/<id>", methods=["POST"])
@flask_praetorian.auth_required
def update_academics(id):
    updated_data = json.loads(request.data.decode('utf-8'))
    academics = db.get_or_404(Academic, id)
    academics.course_name = updated_data['course_name']
    academics.name_of_board_university = updated_data['name_of_board_university']
    academics.passing_year = updated_data['passing_year']
    academics.percentage = updated_data['percentage']

    db.session.commit()

    return "Academics Successfully updated!!"



@app.route("/update_experiences/<id>", methods=['POST'])
@flask_praetorian.auth_required
def update_experience(id):
    updated_data = json.loads(request.data.decode('utf-8'))
    experiences = db.get_or_404(Experience, id)
    experiences.compamy_name = updated_data['company_name']
    experiences.designation = updated_data['designation']
    experiences.from_date = updated_data['from_date']
    experiences.to_date = updated_data['to_date']

    db.session.commit()

    return "Experiences Successfully updated!!"



@app.route("/update_languages/<id>", methods=["POST"])
@flask_praetorian.auth_required
def update_languages(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    languages= db.get_or_404(Language, id)

    languages.language = updated_data['language']
    languages.read = updated_data["read"]
    languages.write = updated_data["write"]
    languages.speak = updated_data["speak"]

    db.session.commit()

    return "Languages succussfully updated!!"



@app.route("/update_technologies/<id>", methods=["POST"])
@flask_praetorian.auth_required
def update_technologies(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    technologies = db.get_or_404(Technology, id)

    technologies.technology = updated_data["technology"]
    technologies.ranting = updated_data["ranting"]

    db.session.commit()

    return "Technology updated successfully!!"



@app.route("/update_references/<id>", methods=['POST'])
@flask_praetorian.auth_required
def update_references(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    references = db.get_or_404(Reference, id)

    references.refe_name = updated_data['refe_name']
    references.refe_contact_no = updated_data["refe_contact_no"]
    references.refe_relation = updated_data["refe_relation"]

    db.session.commit()

    return "References updated successfully!!!!"



@app.route("/update_preferences/<id>", methods= ["POST"])
@flask_praetorian.auth_required
def update_preferences(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    preferences =  db.get_or_404(Preference, id)

    preferences.prefer_location = updated_data["prefer_location"]
    preferences.notice_period = updated_data["notice_period"]
    preferences.expected_ctc = updated_data["expected_ctc"]
    preferences.current_ctc = updated_data["current_ctc"]
    preferences.department = updated_data["department"]

    db.session.commit()

    return "Preferences Upadated Successfully !!!!"




# DELETE......................................

@app.route("/delete_candidate/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_candidate(id):

    candidate = db.get_or_404(Candidate, id)

    db.session.delete(candidate)
    db.session.commit()

    return "Candidate deleted successfully!!!"


@app.route("/delete_academic/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_academic(id):

    academic = db.get_or_404(Academic, id)

    db.session.delete(academic)

    db.session.commit()

    return "Academics deleted successfully!!!"


@app.route("/delete_experience/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_experience(id):

    experience = db.get_or_404(Experience, id)

    db.session.delete(experience)

    db.session.commit()

    return "Experience deleted successfully!!!"




@app.route("/delete_language/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_language(id):

    language = db.get_or_404(Language, id)

    db.session.delete(language)

    db.session.commit()

    return "Language deleted successfully!!!!"




@app.route("/delete_technology/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_technology(id):

    technology = db.get_or_404(Technology, id)

    db.session.delete(technology)

    db.session.commit()

    return "Technology deleted successfully!!!"



@app.route("/delete_reference/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_reference(id):

    reference = db.get_or_404(Reference, id)

    db.session.delete(reference)

    db.session.commit()

    return "Reference deleted successfully !!!"



@app.route("/delete_preference/<id>", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_preference(id):

    preference = db.get_or_404(Preference, id)

    db.session.delete(preference)

    db.session.commit()

    return "Preference deleted successfully!!!!"












with app.app_context(): 
    db.create_all()

# with app.test_request_context("/create_candidate"):
# @app.route('/create_candidate', methods=['GET', 'POST'])
# def create_candidate():
#     if request.method == 'POST':
#         candidate = request.data
#         print(candidate)
#         return candidate



if(__name__ == '__main__'):
    app.run(debug=True)

