FROM joyzoursky/python-chromedriver:3.7-selenium

# Starting from Ubuntu Xenial
# FROM ubuntu:xenial

# We need wget to set up the PPA, Xvfb to have a virtual screen and unzip to extract ChromeDriver
# RUN apt-get update
# RUN apt-get install -y wget xvfb unzip

# Set up the Chrome PPA
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Update the package list and install Chrome
# RUN apt-get update
# RUN apt-get install -y google-chrome-stable

# Set up ChromeDriver environment variables
# ENV CHROMEDRIVER_VERSION 2.39
# ENV CHROMEDRIVER_DIR /chromedriver

# Download and install ChromeDriver
# RUN mkdir $CHROMEDRIVER_DIR
#RUN wget -q --continue -P $CHROMEDRIVER_DIR "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip"
# RUN unzip $CHROMEDRIVER_DIR/chromedriver* -d $CHROMEDRIVER_DIR

# Put ChromeDriver into the PATH
# ENV PATH $CHROMEDRIVER_DIR:$PATH

# RUN apt-get update
#RUN apt-get install -y software-properties-common vim
# RUN add-apt-repository ppa:jonathonf/python-3.6
# RUN apt-get update

# RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv

# update pip
RUN python -m pip install pip --upgrade
# RUN python3.6 -m pip install wheel

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

ADD . /app
# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
# ENV NAME World

# Run manage.py when the container launches
CMD ["python3.7", "manage.py"]
