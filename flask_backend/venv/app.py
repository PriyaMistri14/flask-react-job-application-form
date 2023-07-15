from flask import Flask, render_template, request, jsonify, make_response, session
from flask_sqlalchemy import SQLAlchemy

from flask_cors import CORS, cross_origin


from flask_migrate import migrate, Migrate

from datetime import datetime, timedelta

import json


import jwt


from flask_bcrypt import Bcrypt

from functools import wraps









db = SQLAlchemy()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"]= 'postgresql://postgres:Dev%40123@localhost:5432/flask_db'
app.config["SECRET_KEY"] ="12345678"

db.init_app(app)

CORS(app)

bcrypt= Bcrypt(app)  # for password hashing

migrate = Migrate(app,db)



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



class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable= False)
    password = db.Column(db.String, unique= False, nullable = False)



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
    print("user_obj:::", user_obj)

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
    print("login data", login_data)
    username = login_data["username"]
    password = login_data["password"]

    user = User.query.filter_by(email = username).first()

    if user and bcrypt.check_password_hash(user.password,password):
        session["is_logged_in"] = True
        token = jwt.encode({
            'user':username,
            'expiration': str(datetime.utcnow() + timedelta(seconds = 120))
        }, app.config["SECRET_KEY"])

        json_token = json.dumps({'token': token.decode('utf-8')})
        return make_response({"data":json_token, "message":"successfully login!"}, 200)

    return  make_response({"data":"", "message":"No active account found with the given credentials!"}, 200)   



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






# HOME PAGE.....
@app.route('/')
@token_required
def home():
    # return render_template("home.html")
    print("Calllllled")
    return make_response({"data":"", "message":"token verified!"}, 200)   


# CREATE CANDIDATE......
@app.route('/create_candidate', methods= ['POST'])
def create_candidate():
    candidate = json.loads(request.data.decode('utf-8'))
    print(candidate)

    cand_obj = Candidate(fname=candidate['fname'],
                         lname = candidate["lname"],
                         surname = candidate["surname"],
                         contact_no = candidate["contact_no"],
                         gender = candidate["gender"],
                         email = candidate["email"],
                         city = candidate["city"],
                         state = candidate["state"],
                         dob = candidate["dob"]

                         )
    db.session.add(cand_obj)
    db.session.commit()
    return f"Successfully created!! {cand_obj}"


@app.route("/create_academic", methods=["POST"])
def create_academic():
    academic = json.loads(request.data.decode('utf-8'))
    acad_obj = Academic(course_name = academic['course_name'],
                        name_of_board_university = academic["name_of_board_university"],
                        passing_year = academic["passing_year"],
                        percentage = academic["percentage"],
                        candidate_id = academic["candidate_id"]
                        )

    db.session.add(acad_obj)
    db.session.commit()

    return f"Academic created successfully !! {acad_obj} "



@app.route("/create_experience", methods=["POST"])
def create_experience():
    experience = json.loads(request.data.decode('utf-8'))

    expe_obj = Experience(company_name = experience["company_name"],
                          designation = experience["designation"],
                          from_date = experience["from_date"],
                          to_date = experience["to_date"],
                          candidate_id = experience["candidate_id"]
                          )

    db.session.add(expe_obj)
    db.session.commit()

    return f"Experience created successfully !! {expe_obj} "




@app.route("/create_language", methods=["POST"])
def create_language():
    language = json.loads(request.data.decode('utf-8'))

    lang_obj = Language(language= language["language"],
                        read = language['read'],
                        write = language["write"],
                        speak = language['speak'],
                        candidate_id=language["candidate_id"]
                        )


    db.session.add(lang_obj)
    db.session.commit()

    return f"Language  created successfully !! {lang_obj} "



@app.route("/create_technology", methods=["POST"])
def create_techmology():
    technology = json.loads(request.data.decode('utf-8'))

    tech_obj = Technology(technology = technology["technology"],
                          ranting = technology["ranting"],
                          candidate_id=technology["candidate_id"]
                          )

    db.session.add(tech_obj)

    db.session.commit()


    return f"Technology created successfully !!! {tech_obj}"



@app.route("/create_reference", methods= ["POST"])
def create_reference():
    reference = json.loads(request.data.decode('utf-8'))

    refe_obj = Reference(refe_name = reference["refe_name"],
                         refe_contact_no = reference["refe_contact_no"],
                         refe_relation = reference["refe_relation"],
                         candidate_id=reference["candidate_id"]
                         )


    db.session.add(refe_obj)
    db.session.commit()

    return f"Reference created successfully !!! {refe_obj}"




@app.route("/create_preference", methods=["POST"])
def create_preference():
    preference = json.loads(request.data.decode('utf-8'))

    pref_obj = Preference(prefer_location = preference["prefer_location"],
                          notice_period = preference["notice_period"],
                          expected_ctc = preference["expected_ctc"],
                          current_ctc = preference["current_ctc"],
                          department = preference["department"],
                          candidate_id = preference["candidate_id"]

                          )

    db.session.add(pref_obj)
    db.session.commit()

    return f"Preference created successfully!!! {pref_obj}"








# SHOW CANDIDATES
@app.route('/show_candidates', methods=['GET'])
def show_candidates():
    all_candidates = db.session.execute(db.select(Candidate)).all()
    cand = []

    print("all_candidates:::", all_candidates[0][0].fname, "json::::", cand)

    for candidate in all_candidates:
        print("candidate[0].academics:::::::::::::::::::::::::::::::::::::::", candidate[0].academics)
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
        print("all_candidates:::", all_candidates,"json::::", cand)


    return cand





# UPDATE............................
@app.route("/update_candidate/<id>", methods=["POST"])
def update_candidate(id):
    updated_data = json.loads(request.data.decode('utf-8'))
    candidate = db.get_or_404(Candidate, id)
    print("..............candidate", candidate, "updated data::::::", updated_data )
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
def update_technologies(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    technologies = db.get_or_404(Technology, id)

    technologies.technology = updated_data["technology"]
    technologies.ranting = updated_data["ranting"]

    db.session.commit()

    return "Technology updated successfully!!"



@app.route("/update_references/<id>", methods=['POST'])
def update_references(id):
    updated_data = json.loads(request.data.decode('utf-8'))

    references = db.get_or_404(Reference, id)

    references.refe_name = updated_data['refe_name']
    references.refe_contact_no = updated_data["refe_contact_no"]
    references.refe_relation = updated_data["refe_relation"]

    db.session.commit()

    return "References updated successfully!!!!"



@app.route("/update_preferences/<id>", methods= ["POST"])
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
def delete_candidate(id):

    candidate = db.get_or_404(Candidate, id)

    db.session.delete(candidate)
    db.session.commit()

    return "Candidate deleted successfully!!!"


@app.route("/delete_academic/<id>", methods=["DELETE"])
def delete_academic(id):

    academic = db.get_or_404(Academic, id)

    db.session.delete(academic)

    db.session.commit()

    return "Academics deleted successfully!!!"


@app.route("/delete_experience/<id>", methods=["DELETE"])
def delete_experience(id):

    experience = db.get_or_404(Experience, id)

    db.session.delete(experience)

    db.session.commit()

    return "Experience deleted successfully!!!"




@app.route("/delete_language/<id>", methods=["DELETE"])
def delete_language(id):

    language = db.get_or_404(Language, id)

    db.session.delete(language)

    db.session.commit()

    return "Language deleted successfully!!!!"




@app.route("/delete_technology/<id>", methods=["DELETE"])
def delete_technology(id):

    technology = db.get_or_404(Technology, id)

    db.session.delete(technology)

    db.session.commit()

    return "Technology deleted successfully!!!"



@app.route("/delete_reference/<id>", methods=["DELETE"])
def delete_reference(id):

    reference = db.get_or_404(Reference, id)

    db.session.delete(reference)

    db.session.commit()

    return "Reference deleted successfully !!!"



@app.route("/delete_preference/<id>", methods=["DELETE"])
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

